import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/core/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';
import { GenericService } from 'src/app/services/generic.service';
import { OfferService } from 'src/app/services/offer.service';
import { Clipboard } from '@angular/cdk/clipboard';



@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.component.html',
  styleUrls: ['./new-offer.component.css'],
})
export class NewOfferComponent implements OnInit {
 
  public subscriptions: Subscription[] = [];
  public user: User | undefined;
  public userId: any;

  public listOffers : any[] = [];
  public pageSize: number = 10;
  public current: number = 1;
  public total: number = 0;
  public totalElementByPage = 0;
  public isLoadingTable = false;

  // * Variables para agregar un usuario
  public createForm!: FormGroup;
  public visibleCreateDrawer = false;
  public isLoadingCreateDrawer = false;

  public currentStep = 0;
  public index = '';

  public addFormBeneficts!: FormGroup;
  public addFormActivities!: FormGroup;
  public addFormHabilities!: FormGroup;

  public listBeneficts: any = [];
  public listActivities: any = [];
  public listHabilities: any = [];

  public ofertaForm: any;

  public isLoadingGeneral = false;

  public listSubcategory: any = [];
  public listLevelStudy: any = [];
  public listRangeAmount: any = [];
  public listTypeOfJob: any = [];
  public listTypeOfPayments: any = [];
  public listStates: any = [];
  public listCitiesByState: any = [];
  public listCompanies: any = [];
  public citySelected: any;
  public stateSelected: any = null;

  public isVisibleDuplicate = false; 
  public findOfferForm !: FormGroup;
  public isLoadingPostulates: boolean = false;
  public elementCopy: any;
  public offer: any;


  constructor(
    private clipboard: Clipboard,
    private companyService: CompanyService,
    private genericService: GenericService,
    private authenticationService: AuthService,
    private offerService: OfferService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private ngxSpinner: NgxSpinnerService
  ) {
    this.createForm = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(100), Validators.minLength(5)]],
      category: [null, [Validators.required]],
      company: [null, [Validators.required]],
      urgency: [null, [Validators.required]],
      typeOfJob: [null, [Validators.required]],
      rangeAmount: [null, [Validators.required]],
      levelStudy: [null, [Validators.required]],
      workPlace: [null, [Validators.required]],
      description: [null, [Validators.required, Validators.maxLength(500), Validators.minLength(10)]],
      state: [null, [Validators.required]],
      city: [null, [Validators.required]],
      showCompany: ['A'],
      showSalary: ['A'],
    });

    this.findOfferForm = this.fb.group({
      keyword: ['']
    });

    this.addFormBeneficts = this.fb.group({
      value: [
        null,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.minLength(8),
        ],
      ],
    });

    this.addFormActivities = this.fb.group({
      value: [
        null,
        [
          Validators.required,
          Validators.maxLength(80),
          Validators.minLength(8),
        ],
      ],
    });

    this.addFormHabilities = this.fb.group({
      value: [
        null,
        [
          Validators.required,
          Validators.maxLength(80),
          Validators.minLength(8),
        ],
      ],
    });
  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      this.userId = this.user.id;
      this.getCompaniesByUser(this.userId);
      this.getLevelStudy();
      this.getRangeAmount();
      this.getTypeOfJob();
      this.getSubcategories();
      this.getStates();
      this.getOffers();
    } else {
      this.router.navigateByUrl('/auth/login');
    }
    this.ngxSpinner.show();

    setTimeout(() => {
      this.ngxSpinner.hide();
    }, 2000);
  }

  preStep(): void {
    this.currentStep -= 1;
  }

  nextStep(): void {
    this.changeContent();
  }

  doneSteps(): void {

    let mainActivities : any = [];
    let habilities : any = [];
    let beneficts : any = [];

    this.listActivities.forEach((e : any) => {mainActivities.push(e.value);});
    this.listBeneficts.forEach((e : any) => {beneficts.push(e.value);});
    this.listHabilities.forEach((e : any) => {habilities.push(e.value);});

    let data = {
      "address": "",
      "category": 1,
      "city": this.ofertaForm.city,
      "company": this.ofertaForm.company,
      "country": 1, //MX
      "description": this.ofertaForm.description,
      "levelStudy": this.ofertaForm.levelStudy,
      "rangeAmount": this.ofertaForm.rangeAmount,
      "showCompany": this.ofertaForm.showCompany == 'A' ? true : false,
      "showSalary": this.ofertaForm.showSalary == 'A' ? true : false,
      "state": this.ofertaForm.state,
      "subcategory": this.ofertaForm.category,
      "title": this.ofertaForm.title,
      "typeOfJob": this.ofertaForm.workPlace,
      "typeOfOffer": 1,
      "typeOfPayment": 2,
      "urgency": this.ofertaForm.urgency,
      "userId": this.userId,
      "workPlace": this.ofertaForm.typeOfJob,
      "benefits": beneficts,
      "skills": habilities,
      "mainActivities": mainActivities,
    }

    this.ngxSpinner.show();
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.offerService.createOffer(data).subscribe(
        (response: any) => {
          this.listCompanies = response;
          this.isLoadingGeneral = false;
          this.ngxSpinner.hide();
          this.router.navigateByUrl('/dashboard/my-offers');
          this.message.create('success', "Oferta creada correctamente");
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingGeneral = false;
          this.ngxSpinner.hide();
          this.message.create('error', errorResponse.error.message);
        }
      )
    );

  }

  
  public onBack() {
    this.router.navigateByUrl('/dashboard/my-offers');
  }

  changeContent(): void {
    switch (this.currentStep) {
      case 0: {
        for (const i in this.createForm.controls) {
          if (this.createForm.controls.hasOwnProperty(i)) {
            this.createForm.controls[i].markAsDirty();
            this.createForm.controls[i].updateValueAndValidity();
          }
        }

        if (!this.createForm.valid) {
          this.createMessage(
            'warning',
            'Es necesario llenar todos los campos!'
          );
          return;
        }

        this.currentStep += 1;
        this.ofertaForm = this.createForm.value;

        break;
      }
      case 1: {
        if (this.listActivities.length == 0) {
          this.createMessage('warning', 'Es necesario agregar una actividad!');
          return;
        }

        if (this.listBeneficts.length == 0) {
          this.createMessage('warning', 'Es necesario agregar una beneficio!');
          return;
        }

        if (this.listHabilities.length == 0) {
          this.createMessage('warning', 'Es necesario agregar una habilidad!');
          return;
        }

        this.currentStep += 1;

        break;
      }
      case 2: {
        this.currentStep += 1;

        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }

  public copy(value: any) {
    // Note the parameters
    this.clipboard.copy(value);
    this.createMessage('success', '¡Copiado correctamente!');
  }

  submitForm(): void {}

  submitActivities() {
    for (const i in this.addFormActivities.controls) {
      if (this.addFormActivities.controls.hasOwnProperty(i)) {
        this.addFormActivities.controls[i].markAsDirty();
        this.addFormActivities.controls[i].updateValueAndValidity();
      }
    }

    if (!this.addFormActivities.valid) {
      return;
    }

    let form = this.addFormActivities.value;
    this.listActivities.push({
      value: form.value,
      index: this.listActivities.length - 1,
    });

    this.addFormActivities.reset();
  }

  addHabilities() {
    for (const i in this.addFormHabilities.controls) {
      if (this.addFormHabilities.controls.hasOwnProperty(i)) {
        this.addFormHabilities.controls[i].markAsDirty();
        this.addFormHabilities.controls[i].updateValueAndValidity();
      }
    }

    if (!this.addFormHabilities.valid) {
      return;
    }

    let form = this.addFormHabilities.value;
    this.listHabilities.push({
      value: form.value,
      index: this.listHabilities.length - 1,
    });
    this.addFormHabilities.reset();

  }

  addBeneficts() {
    for (const i in this.addFormBeneficts.controls) {
      if (this.addFormBeneficts.controls.hasOwnProperty(i)) {
        this.addFormBeneficts.controls[i].markAsDirty();
        this.addFormBeneficts.controls[i].updateValueAndValidity();
      }
    }

    if (!this.addFormBeneficts.valid) {
      return;
    }

    let form = this.addFormBeneficts.value;
    let p = this.listBeneficts.push({
      value: form.value,
      index: this.listBeneficts.length - 1,
    });
    this.addFormBeneficts.reset();
  }

  public removeHability(item: any) {
    let index = this.listHabilities
      .map((e: any) => e.index)
      .indexOf(item.index);
    let p = this.listHabilities.splice(index, 1);
  }

  public removeActivity(item: any) {
    let index = this.listActivities
      .map((e: any) => e.index)
      .indexOf(item.index);
    let p = this.listActivities.splice(index, 1);
  }

  public removeBenefict(item: any) {
    let index = this.listBeneficts.map((e: any) => e.index).indexOf(item.index);
    this.listBeneficts.splice(index, 1);
  }

  public getCompaniesByUser(ele: any) {
  
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.companyService.getCompaniesByOwnerWP(ele).subscribe(
        (response: any) => {
          this.listCompanies = response;
          this.isLoadingGeneral = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingGeneral = false;
          this.message.create('error', errorResponse.error.message);
        }
      )
    );
  }

  provinceChange(value: any): void {
    if (value) {
      this.citySelected = undefined;
      this.getCitiesByState(value);
    } else {
      this.listCitiesByState = [];
      this.citySelected = undefined;
    }
  }

  public getCitiesByState(state: any) {
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.genericService.getAllCities(state).subscribe(
        (response: any) => {
          this.listCitiesByState = response;
          this.isLoadingGeneral = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingGeneral = false;
          this.message.create('error', errorResponse.error.message);
        }
      )
    );
  }

  public getStates() {
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.genericService.getAllStates().subscribe(
        (response: any) => {
          this.listStates = response;
          this.isLoadingGeneral = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingGeneral = false;
          this.message.create('error', errorResponse.error.message);
        }
      )
    );
  }

  public getTypeOfPayment() {
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.genericService.getAllTypeOfPayments().subscribe(
        (response: any) => {
          this.listSubcategory = response;
          this.isLoadingGeneral = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingGeneral = false;
          this.message.create('error', errorResponse.error.message);
        }
      )
    );
  }

  public getSubcategories() {
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.genericService.getAllSubcategoriesByCategory().subscribe(
        (response: any) => {
          this.listSubcategory = response;
          this.isLoadingGeneral = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingGeneral = false;
          this.message.create('error', errorResponse.error.message);
        }
      )
    );
  }

  public getRangeAmount() {
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.genericService.getAllRangeAmount().subscribe(
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

  public getLevelStudy() {
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.genericService.getAllTypeOfLevelStudy().subscribe(
        (response: any) => {
          this.listLevelStudy = response;
          this.isLoadingGeneral = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingGeneral = false;
          this.message.create('error', errorResponse.error.message);
        }
      )
    );
  }

  public getTypeOfJob() {
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.genericService.getAllTypeOfJobs().subscribe(
        (response: any) => {
          this.listTypeOfJob = response;
          this.isLoadingGeneral = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingGeneral = false;
          this.message.create('error', errorResponse.error.message);
        }
      )
    );
  }

  public getCategory(item: any): string {
    let index = this.listSubcategory.find((e: any) => e.id == item);
    let p = index.valor;
    return p;
  }

  public getCompany(item: any): string {
    let index = this.listCompanies.find((e: any) => e.id == item);
    let p = index.name;
    return p;
  }

  public getLevelOfStudy(item: any): string {
    let index = this.listLevelStudy.find((e: any) => e.id == item);
    let p = index.valor;    
    return p;
  }

  public getTypeOfJobS(item: any): string {
    let index = this.listTypeOfJob.find((e: any) => e.id == item);
    let p = index.valor;    
    return p;
  }

  public getWorkPlace(item: any): string {
    let works = [
      { value: 'Jornada Completa', id: 'A' },
      { value: 'Media jornada', id: 'B' },
      { value: 'Pasantias', id: 'C' },
      { value: 'Por proyecto', id: 'D' },
    ];
    let index: any = works.find((e: any) => e.id == item);
    return index.value;
  }

  public getRangeAmountS(item: any) {
    let index = this.listRangeAmount.find((e: any) => e.id == item);
    let p = index.valor;    
    return p;
  }

  public showModalCopy() {
    this.isVisibleDuplicate = true;
  }

  public closeModalCopy() {
    this.isVisibleDuplicate = false;
    this.elementCopy = undefined;
    this.listOffers.map((e : any) => e.status = false);
  }


  public copyOffer() {
    this.getOfferById();
  }

  public submitFormCopy() {
    

    let form = this.findOfferForm.value;

    this.ngxSpinner.show();
    this.isLoadingPostulates = true;
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.offerService
        .getOffers({
          pageNo: this.current - 1,
          pageSize: this.pageSize,
          userId: this.userId,
          keyword: form.keyword,
        })
        .subscribe(
          (response: any) => {
            this.listOffers = response.content.map((prop: any, key: any) => {
              return {
                ...prop,
                status: false,
                key: key + 1,
              };
            });            this.total = response.totalElements;
            this.totalElementByPage = response.numberOfElements;
            this.isLoadingGeneral = false;
            this.isLoadingPostulates = false;
            this.loader();
         
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingPostulates = false;
            this.isLoadingGeneral = false;
            this.message.create('error', errorResponse.error.message);
            this.ngxSpinner.hide();
          }
        )
    )

  }


  public getOfferById() {
    this.isLoadingGeneral = true;
    this.ngxSpinner.show();
    this.subscriptions.push(
      this.offerService.findOfferById(this.elementCopy.id).subscribe(
        (response: any) => {

          this.offer = response;
          this.isLoadingGeneral = false;
          this.ngxSpinner.hide();
          this.closeModalCopy();
          this.citySelected = response.city.id;
          this.listActivities = response.mainActivities.map((prop: any, key: any) => {return {value: prop,key: key + 1}}); 
          this.listBeneficts = response.benefits.map((prop: any, key: any) => {return {value: prop,key: key + 1}}); 
          this.listHabilities = response.skills.map((prop: any, key: any) => {return {value: prop,key: key + 1}}); 
        
          
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingGeneral = false;
          this.ngxSpinner.hide();
          this.message.create('error', errorResponse.error.message);
        }
      )
    );
  }

  getOffers(): void {

    this.ngxSpinner.show();
    this.isLoadingPostulates = true;
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.offerService
        .getOffers({
          pageNo: this.current - 1,
          pageSize: this.pageSize,
          userId: this.userId,
          keyword: this.findOfferForm.value["keyword"],
        })
        .subscribe(
          (response: any) => {

            console.log(response);
            
            this.listOffers = response.content.map((prop: any, key: any) => {
              return {
                ...prop,
                status: false,
                key: key + 1,
              };
            });
            
            this.total = response.totalElements;
            this.totalElementByPage = response.numberOfElements;
            this.isLoadingGeneral = false;
            this.isLoadingPostulates = false;
            this.loader();
         
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingPostulates = false;
            this.isLoadingGeneral = false;
            this.message.create('error', errorResponse.error.message);
            this.ngxSpinner.hide();
          }
        )
    )
  }
  
  changePageSize($event: number) : void {
    this.pageSize = $event;
    this.getOffers();
  }

   changeCurrentPage($event: number) : void {
    this.current = $event;
    this.getOffers();
   }






   public seledtedCopy(data : any) {

    console.log(data);

    this.elementCopy = data;
    this.listOffers.map((e : any) => e.status = false);
    data.status = true;

   }

  public getUrgency(item: any): string {
    let urgency = [
      { value: 'Urgente', id: 'A' },
      { value: 'Moderada', id: 'B' },
      { value: 'Baja', id: 'C' },
    ];
    let index: any = urgency.find((e: any) => e.id == item);
    return index.value;
  }

  public showValues(item: any): string {
    if ((item = 'A')) {
      return 'Mostrar';
    }
    return 'No mostrar';
  }

  public loader() {
    this.ngxSpinner.show();

    setTimeout(() => {
      this.ngxSpinner.hide();
    }, 800);
  }

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }
}
