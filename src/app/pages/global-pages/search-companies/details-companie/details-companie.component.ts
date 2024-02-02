import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/core/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';
import { OfferService } from 'src/app/services/offer.service';

@Component({
  selector: 'app-details-companie',
  templateUrl: './details-companie.component.html',
  styleUrls: ['./details-companie.component.scss'],
})
export class DetailsCompanieComponent implements OnInit {
  public subscriptions: Subscription[] = [];

  public isLoadingGeneral: boolean = false;
  public user: User | undefined;
  public userId: any;
  public subcriptions: Subscription[] = [];
  public currentElement: any;
  companyId: any;

  public validateForm!: FormGroup;

  // Offers

  public pageSizeO: number = 12;
  public currentO: number = 1;
  public offers: any[] = [];
  public totalO: number = 0;
  public totalElementByPageO = 0;
  public isLoadingTableO = false;

  public pageSizeOp: number = 12;
  public currentOp: number = 1;
  public opinions: any[] = [];
  public totalOp: number = 0;
  public totalElementByPageOp = 0;
  public isLoadingTableOp = false;
  isVisibleAdd: boolean = false;
  public isLoadingReview = false;
  rating : any ;
  role: string = '';

  constructor(
    private readonly meta: Meta,
    private readonly title: Title,
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private ngxSpinner: NgxSpinnerService,
    private offerService: OfferService,
    private notification: NzNotificationService,
    private companyService: CompanyService
  ) {
    this.validateForm = this.fb.group({
      culture: [5],
      rangeAmountQ: [5],
      opinion: [''],
      oportunities: [5],
      title: [''],
    });
  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      this.userId = this.user.id;
      this.role = this.user.role;
    } 

    this.companyId = this.actRoute.snapshot.params.id;
    this.getCopmanyById(this.companyId);
  }

  getCopmanyById(id: any) {
    this.isLoadingGeneral = true;
    this.ngxSpinner.show();
    this.companyService.getCompanyById(id).subscribe(
      (response: any) => {
        this.currentElement = response;
        this.title.setTitle(this.currentElement.name);
        console.log(this.currentElement);
        this.isLoadingGeneral = false;
        this.ngxSpinner.hide();
        this.getOfferByCompany();
        this.getOpinionsByCompany();
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create('error', errorResponse.error.message);
        this.isLoadingGeneral = false;
        this.ngxSpinner.hide();
      }
    );
  }

  public getOfferByCompany(): void {
    this.isLoadingTableO = true;
    this.subscriptions.push(
      this.offerService
        .getOfferByCompany({
          pageNo: this.currentO - 1,
          pageSize: this.pageSizeO,
          company: this.companyId,
        })
        .subscribe(
          (response: any) => {
            this.offers = response.content;
            this.totalO = response.totalElements;
            this.totalElementByPageO = response.numberOfElements;
            this.isLoadingTableO = false;
            this.ngxSpinner.hide();

            console.log(this.offers);
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingTableO = false;
            this.ngxSpinner.hide();
            this.message.create('error', 'Ha ocurrido un error!');
          }
        )
    );
  }

  changePageSizeO($event: number): void {
    console.log('Change page size: ' + $event);
    this.currentO = $event;
    this.getOfferByCompany();
  }

  changeCurrentPageO($event: number): void {
    this.currentO = $event;
    this.getOfferByCompany();
  }

  public getOpinionsByCompany(): void {
    this.isLoadingTableOp = true;
    this.subscriptions.push(
      this.companyService
        .getOpinionsByCompay({
          pageNo: this.currentOp - 1,
          pageSize: this.pageSizeOp,
          companyId: this.companyId,
        })
        .subscribe(
          (response: any) => {
            this.opinions = response.content.map((prop: any, key: any) => {
              return {
                ...prop,
                rating: (prop.culture + prop.rangeAmountQ + prop.oportunities) / 3,
              };
            }); 

            this.totalOp = response.totalElements;
            this.totalElementByPageOp = response.numberOfElements;
            this.isLoadingTableOp = false;
            
            this.calculateRating();


            this.ngxSpinner.hide();

          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingTableOp = false;
            this.ngxSpinner.hide();
            this.message.create('error', 'Ha ocurrido un error!');
          }
        )
    );
  }

 
  changePageSizeOp($event: number): void {
    console.log('Change page size: ' + $event);
    this.currentOp = $event;
    this.getOfferByCompany();
  }

  changeCurrentPageOp($event: number): void {
    this.currentOp = $event;
    this.getOfferByCompany();
  }

  saveOpinion() {
    if (!this.validateForm.valid) {
      for (const i in this.validateForm.controls) {
        if (this.validateForm.controls.hasOwnProperty(i)) {
          this.validateForm.controls[i].markAsDirty();
          this.validateForm.controls[i].updateValueAndValidity();
        }
      }
      return;
    }

    let form = this.validateForm.value;
    this.calculateRating();

    this.isLoadingReview = true;
    this.ngxSpinner.show();
    this.subscriptions.push(
      this.companyService
        .createOpinion({
          ...form,
          company: this.companyId,
          userId: this.userId,
          rating: this.rating
        })
        .subscribe(
          (response: any) => {
            this.isLoadingReview = false;
            this.ngxSpinner.hide();
            this.message.create('success', 'Opinion creada correctamente');
            this.isVisibleAdd = false;
            this.validateForm.reset();
            this.getOpinionsByCompany();
          },
          (errorResponse: HttpErrorResponse) => {
            this.ngxSpinner.hide();
            this.isLoadingReview = false;
            this.message.create('info', errorResponse.error.message);
          }
        )
    );
  }

  handleCancel() {
    this.isVisibleAdd = false;
  }

  showModalAddModal() {
    if (!this.authenticationService.isUserLoggedIn()) {
      this.createNotification('warning', 'Es necesario iniciar sesión para poder postularte');
      this.router.navigateByUrl("/auth/login");
      return;
    }else {
      this.isVisibleAdd = true;
    }

  }

  calculateRating( ) {
    let totalCalf = 0;

    this.opinions.forEach((e : any) => {
      totalCalf += e.rating;      
    });

    let r = totalCalf / this.opinions.length;

    console.log(this.rating);
    

    if(!this.rating && this.opinions.length == 0) {
        this.rating = 0;
    }else {
    this.rating = r;
    }
    
    return this.rating;
  }

  public getUrgency(item: any): string {
    let urgency = [
      { value: 'Solicita personal urgentemente', id: 'A' },
      { value: 'Urgencia moderada', id: 'B' },
      { value: 'Solicita personal', id: 'C' },
    ];
    let index: any = urgency.find((e: any) => e.id == item);
    return index.value;
  }

  
  public getUrgencyColor(item: any): string {
    let urgency = [
      { value: 'error', id: 'A' },
      { value: 'warning', id: 'B' },
      { value: 'processing', id: 'C' },
    ];
    let index: any = urgency.find((e: any) => e.id == item);
    return index.value;
  }

  createNotification(type: string, message: string): void {
    this.notification.create(
      type,
      'Importante!',
      `${message} 🫠`,
      { nzPlacement: 'topLeft' }
    );
  }
}
