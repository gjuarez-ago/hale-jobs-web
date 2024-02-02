import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/core/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { GenericService } from 'src/app/services/generic.service';
import { HistoryService } from 'src/app/services/history.service';
import { OfferService } from 'src/app/services/offer.service';
import { WorkersService } from 'src/app/services/workers.service';

@Component({
  selector: 'app-rh-search-workers',
  templateUrl: './rh-search-workers.component.html',
  styleUrls: ['./rh-search-workers.component.css'],
})
export class RhSearchWorkersComponent implements OnInit {

  public user: User| undefined;
  public userId : any;

  
  // * Variables de la tabla
  public data: any[] = [];
  public pageSize: number = 10 ;
  public current: number = 1;
  public subscriptions: Subscription[] = [];
  public total: number = 0;
  public totalElementByPage = 0;

  //  public data : Content[] = [];
  //  public temp : Content[] = [];
  public isLoadingTable = false;

  // * Variables para visualizar la orden

  public visibleDrawer = false;
  public isLoadingDrawer = false;
  //  public viewElement :  Loan | undefined = undefined;

  // * Variables genericas
  public isLoadingGeneral = false;
  public dateFormat = 'yyyy/MM/dd';

  // * Variables para realizar el filtrado
  public validateForm!: FormGroup;
  public listModwork: any[] = [];
  public listStates: any[] = [];
  public listRangeAmount: any[] = [];
  public listCities: any[] = [];
  citySelected: any;
  stateSelected : any;
  public isLoadingResponse = false;
  listOffers : any[] = [];



  public psResponseEmailForm!: FormGroup;
  public visiblePsStatusOffer: boolean = false;
  postulateP: any;

  constructor(
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private ngxSpinner: NgxSpinnerService,
    private userService: WorkersService,
    private offerService : OfferService,
    private genericService : GenericService,
    private readonly title: Title,   
    private historyService : HistoryService

  ) {
    this.validateForm = this.fb.group({
      jobTitle: [''],
      state: [null],
      city: [null],
      findJob: ['si'],
      salary: [null],
      mod: [null],
    });

    this.psResponseEmailForm = this.fb.group({
      comments: [
        '',
        [
          Validators.required,
          Validators.maxLength(250),
          Validators.minLength(10),
        ],
      ],
      offer: [
        '',
        [
          Validators.required
        ],
      ],
    });

    
  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      this.userId = this.user.id;

      this.getStates();
      this.getRangeAmount();
      this.getModWorks();
      this.getUsersPaginate();
      this.getOffers();
      this.title.setTitle("Búsqueda de personal")


    } else {
      this.router.navigateByUrl("/auth/login");
    }

    this.loader();   
  }

  public loader() {
    this.ngxSpinner.show();

    setTimeout(() => {
      this.ngxSpinner.hide();
    }, 800);
  }

  public clenFilters() {
    this.validateForm = this.fb.group({
      jobTitle: [''],
      state: [null],
      city: [null],
      findJob: ['si'],
      salary: [null],
      mod: [null],
    });
  }

  public getUsersPaginate() {
    this.isLoadingTable = true;
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.userService
        .getAllOffersByUserWEB({
          pageNo: this.current - 1,
          pageSize: this.pageSize,
          city: this.validateForm.value['city']
            ? this.validateForm.value['city']
            : '',
          jobTitle: this.validateForm.value['jobTitle']
            ? this.validateForm.value['jobTitle']
            : '',
          mod: this.validateForm.value['mod']
            ? this.validateForm.value['mod']
            : '',
          salary: this.validateForm.value['salary']
            ? this.validateForm.value['salary']
            : '',
            findJob: this.validateForm.value['findJob']
            ? this.validateForm.value['findJob']
            : '',
          state: this.validateForm.value['state']
            ? this.validateForm.value['state']
            : '',
        })
        .subscribe(
          (response: any) => {
            this.data = response.content;
            this.total = response.totalElements;
            this.totalElementByPage = response.numberOfElements;

            this.isLoadingTable = false;
            this.isLoadingGeneral = false;
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingTable = false;
            this.isLoadingGeneral = false;
            this.message.create('error', errorResponse.error.message);
          }
        )
    );
  }

  submitForm(): void {
    if (!this.validateForm.valid) {
      for (const i in this.validateForm.controls) {
        if (this.validateForm.controls.hasOwnProperty(i)) {
          this.validateForm.controls[i].markAsDirty();
          this.validateForm.controls[i].updateValueAndValidity();
        }
      }

      this.createMessage('warning', 'Es necesario llenar todos los campos!');
      return;
    }

    this.ngxSpinner.show();
    let form = this.validateForm.value;

    this.isLoadingTable = true;
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.userService
        .getAllOffersByUserWEB({
          pageNo: this.current - 1,
          pageSize: this.pageSize,
          city: form.city ? form.city : '',
          jobTitle: form.jobTitle ? form.jobTitle : '',
          mod: form.mod ? form.mod : '',
          salary: form.salary ? form.salary : '',
          findJob: form.findJob ? form.findJob : '',
          state: form.state ? form.state : '',
        })
        .subscribe(
          (response: any) => {
            this.data = response.content;
            this.total = response.totalElements;
            this.totalElementByPage = response.numberOfElements;
            this.isLoadingTable = false;
            this.isLoadingGeneral = false;
            this.ngxSpinner.hide();
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingTable = false;
            this.isLoadingGeneral = false;
            this.ngxSpinner.hide();
            this.message.create('error', errorResponse.error.message);
          }
        )
    );
  }

  public navigateViewJob(element : any) {   
    this.historyService.addchange(element);
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/dashboard/view-worker/${element.id}`]));
       window.open('#' + url, '_blank');        
  }







  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }


  provinceChange(value:any): void {
    if(value) {
      this.citySelected = undefined;
      this.getCities(value);
    }else {
      this.listCities = [];
      this.citySelected = undefined;
    }
  }


  // Llenar catalogos

  getModWorks() {
    this.isLoadingGeneral = true;
    this.genericService.getAllTypeOfJobs().subscribe(
      (response: any) => {
      
        this.listModwork = response.map((prop: any, key: any) => {
          return {
            ...prop,
            key: key + 1,
          };
        }); 
        this.isLoadingGeneral = false;       
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar los estados');
        this.isLoadingGeneral = false;
      }
    )
  }

  
  getStates() {
    this.isLoadingGeneral = true;
    this.genericService.getAllStates().subscribe(
      (response: any) => {
       
        this.listStates = response.map((prop: any, key: any) => {
          return {
            ...prop,
            key: key + 1,
          };
        }); 
        this.isLoadingGeneral = false;       
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar los estados');
        this.isLoadingGeneral = false;
      }
    )
  }

  public getRangeAmount() {
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.genericService
        .getAllRangeAmount()
        .subscribe(
          (response: any) => {
            this.listRangeAmount = response;
            this.isLoadingGeneral = false;
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingGeneral = false;
            this.message.create('error', errorResponse.error.message);
          }
        )
    );
  }


  getCities(p : any) {
    this.isLoadingGeneral = true;
    this.genericService.getAllCities(p).subscribe(
      (response: any) => {
      
        this.listCities = response.map((prop: any, key: any) => {
          return {
            ...prop,
            key: key + 1,
          };
        });        
        this.isLoadingGeneral = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar los municipios');
        this.isLoadingGeneral = false;
      }
    )
  }

  getOffers() {
    this.isLoadingGeneral = true;
    this.offerService.getOfferByUserId(this.userId).subscribe(
      (response: any) => {
      
        this.listOffers = response.map((prop: any, key: any) => {
          return {
            ...prop,
            key: key + 1,
          };
        }); 
        this.isLoadingGeneral = false;       
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar las ofertas');
        this.isLoadingGeneral = false;
      }
    )
  }


  
  public showModalMessagePostulate(item: any) {
    this.visiblePsStatusOffer = true;
    this.postulateP = item;
  }

  public closeModalMessagePostulate() {
    this.visiblePsStatusOffer = false;
    this.postulateP = undefined;
  }

  public submitResponsePostulate() {
    if (!this.psResponseEmailForm.valid) {
      for (const i in this.psResponseEmailForm.controls) {
        if (this.psResponseEmailForm.controls.hasOwnProperty(i)) {
          this.psResponseEmailForm.controls[i].markAsDirty();
          this.psResponseEmailForm.controls[i].updateValueAndValidity();
        }
      }
      this.createMessage('warning', 'Es necesario llenar todos los campos!');
      return;
    }

    this.isLoadingResponse = true;
    let form = this.psResponseEmailForm.value;

    this.ngxSpinner.show();
    this.subscriptions.push(
      this.offerService.messageUSerPostulate({ ...form, offerId: form.offer, status: 0, userId: this.postulateP.id }).subscribe(
        (response: any) => {
          this.ngxSpinner.hide();
          this.closeModalMessagePostulate();
          this.createMessage('success', 'Mensaje enviado :)');

          this.isLoadingResponse = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.ngxSpinner.hide();
          this.isLoadingResponse = false;
          this.message.create('error', errorResponse.error.message);
        }
      )
    );
  }


  public getImage(e : any) {

    if(e == null) {
      return "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/no-profile-picture-icon.png";
    }

    return e;
  }


}

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}
