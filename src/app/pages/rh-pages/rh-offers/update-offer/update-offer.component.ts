import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-update-offer',
  templateUrl: './update-offer.component.html',
  styleUrls: ['./update-offer.component.css']
})
export class UpdateOfferComponent implements OnInit {

  
  public subscriptions: Subscription[] = [];
  public user: User | undefined;
  public userId: any;

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

  public offer : any;
  offerId: any;

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
    private ngxSpinner: NgxSpinnerService,
    private actRoute: ActivatedRoute,
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
      showCompany: ['A'],
      showSalary: ['A'],
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
   
    this.offerId = this.actRoute.snapshot.params.id;

    if (this.authenticationService.isUserLoggedIn()) {

      
      this.user = this.authenticationService.getUserFromLocalCache();
      this.userId = this.user.id;
      this.getCompaniesByUser(this.userId);
      this.getLevelStudy();
      this.getRangeAmount();
      this.getTypeOfJob();
      this.getSubcategories();
      this.getOfferById(this.offerId)

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
      "offerId": this.offerId,
      "address": "",
      "category": 1,
      "company": this.ofertaForm.company,
      "description": this.ofertaForm.description,
      "levelStudy": this.ofertaForm.levelStudy,
      "rangeAmount": this.ofertaForm.rangeAmount,
      "showCompany": this.ofertaForm.showCompany == 'A' ? true : false,
      "showSalary": this.ofertaForm.showSalary == 'A' ? true : false,
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
      this.offerService.editOffer(data).subscribe(
        (response: any) => {
          this.listCompanies = response;
          this.isLoadingGeneral = false;
          this.ngxSpinner.hide();
          this.router.navigateByUrl('/dashboard/my-offers');
          this.message.create('success', "Oferta actualizada correctamente");
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

    console.log(this.listHabilities);
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

  public getOfferById(id : any) {
    this.isLoadingGeneral = true;
    this.ngxSpinner.show();
    this.subscriptions.push(
      this.offerService.findOfferById(id).subscribe(
        (response: any) => {

          this.offer = response;
          this.isLoadingGeneral = false;
          this.ngxSpinner.hide();
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

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }
}
