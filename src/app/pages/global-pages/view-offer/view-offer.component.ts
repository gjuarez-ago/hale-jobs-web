import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/core/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { HistoryService } from 'src/app/services/history.service';
import { OfferService } from 'src/app/services/offer.service';

@Component({
  selector: 'app-view-offer',
  templateUrl: './view-offer.component.html',
  styleUrls: ['./view-offer.component.css']
})
export class ViewOfferComponent implements OnInit {

  public isLoadingGeneral: boolean = false;
  public user: User| undefined;
  public userId : any;
  public subscriptions: Subscription[] = [];
  public currentElement : any;
  offerId: any;

  public complaintForm!: FormGroup;
  public postulateForm!: FormGroup;
  isLoadingReview: boolean = false;
  isVisibleAdd: boolean = false;
  isVisibleAddPostulate: boolean = false;
  public role : any = "";
  
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
    private offerService : OfferService,
    private notification: NzNotificationService,
    private historyService : HistoryService

  ) { 

    this.complaintForm = this.fb.group({
      comments: ["", [Validators.required]],
      category: ["", [Validators.required]]
    });

    this.postulateForm = this.fb.group({
      comments: ["", [Validators.required]]
    });

  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      this.userId = this.user.id;
      this.role = this.user.role;
    }

    this.offerId = this.actRoute.snapshot.params.id;
    this.getOfferById(this.offerId);

  }

  public onBack() {
    this.router.navigateByUrl('/dashboard/my-company');
  }

  public getOfferById(id: any) {
    this.isLoadingGeneral = true;
    this.ngxSpinner.show();
    this.offerService.findOfferById(id).subscribe(
      (response: any) => {
        this.currentElement = response;
        this.title.setTitle(this.currentElement.title + " - "+  this.currentElement.company.name)
        this.isLoadingGeneral=false;
        this.ngxSpinner.hide();
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error",  errorResponse.error.message);
        this.isLoadingGeneral=false;
        this.ngxSpinner.hide();
      }
    )
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
  
  public getUrgency(item: any): string {
    let urgency = [
      { value: 'Solicita personal urgentemente', id: 'A' },
      { value: 'Urgencia moderada', id: 'B' },
      { value: 'Solicita personal', id: 'C' },
    ];
    let index: any = urgency.find((e: any) => e.id == item);
    return index.value;
  }  


  public showModalOffer() {

    if (!this.authenticationService.isUserLoggedIn()) {
      this.createNotification('warning', 'Es necesario iniciar sesión para poder postularte');
      this.router.navigateByUrl("/auth/login");
      return;
    }else {
      this.isVisibleAddPostulate = true;
    }

  }

  public closeOfferPostulate() {
    this.isVisibleAddPostulate = false;
  }

  public showModalComplaint() {
    if (!this.authenticationService.isUserLoggedIn()) {
      this.createNotification('warning', 'Es necesario iniciar sesión para poder levantar una queja o sugerencia');
      this.router.navigateByUrl("/auth/login");
      return;
    }else {
    this.isVisibleAdd = true;
    }
  }
  public closeComplaintModal() {
    this.isVisibleAdd = false;
  }

  public getDays(fecha :any) {
  
    let r = 1;
    var fechaIni : any = new Date(fecha);
// Crear objeto de fecha final (actual)
var fechaFin : any = new Date();
var diff = fechaFin - fechaIni;

    let diferenciaDias = Math.floor(diff / (1000 * 60 * 60 * 24));

    if(diferenciaDias == 0) {
      return "Hace 1 día";
    }

    if(diferenciaDias == 7) {
      return "Hace 1 semana";
    }

    if(diferenciaDias != 7 && diferenciaDias != 0) {
      return "Hace " + diferenciaDias + " días";
    }

    return diferenciaDias;
  }

  submitComplaintForm() {
  
    if (!this.complaintForm.valid) {
      for (const i in this.complaintForm.controls) {
        if (this.complaintForm.controls.hasOwnProperty(i)) {
          this.complaintForm.controls[i].markAsDirty();
          this.complaintForm.controls[i].updateValueAndValidity();
        }
      }
      this.createNotification('warning', 'Es necesario llenar todos los campos!');
      return;
    }


    let form = this.complaintForm.value;

    this.isLoadingReview = true;
    this.ngxSpinner.show();
    this.subscriptions.push(
      this.offerService
        .reportOffer({
          ...form,
          offerId: this.offerId,
          userId: this.userId,
        })
        .subscribe(
          (response: any) => {
            this.isLoadingReview = false;
            this.ngxSpinner.hide();
            this.message.create('success', 'Opinion creada correctamente');
            this.isVisibleAdd = false;
            this.complaintForm.reset();
          },
          (errorResponse: HttpErrorResponse) => {
            this.ngxSpinner.hide();
            this.isLoadingReview = false;
            this.message.create('info', errorResponse.error.message);
          }
        )
    );
  }

  submitPostulateForm() {

    if (!this.postulateForm.valid) {
      for (const i in this.postulateForm.controls) {
        if (this.postulateForm.controls.hasOwnProperty(i)) {
          this.postulateForm.controls[i].markAsDirty();
          this.postulateForm.controls[i].updateValueAndValidity();
        }
      }
      this.createNotification('warning', 'Es necesario llenar todos los campos!');
      return;
    }


    let form = this.postulateForm.value;

    this.isLoadingReview = true;
    
    this.ngxSpinner.show();
    this.subscriptions.push(
      this.offerService
        .postulate({
          ...form,
          offerId: this.offerId,
          userId: this.userId,
        })
        .subscribe(
          (response: any) => {
            this.isLoadingReview = false;
            this.ngxSpinner.hide();
            this.message.create('success', 'Te has postulado correctamente');
            this.isVisibleAddPostulate = false;
            this.complaintForm.reset();
          },
          (errorResponse: HttpErrorResponse) => {
            this.ngxSpinner.hide();
            this.isLoadingReview = false;
            this.message.create('info', errorResponse.error.message);
          }
        )
    );
  


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
