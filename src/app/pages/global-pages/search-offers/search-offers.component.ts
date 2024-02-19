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
import { Offer } from 'src/app/models/core/offer.model';
import { User } from 'src/app/models/core/user.model';
import { PostulatesOffer } from 'src/app/models/postulates-offer.model';
import { AuthService } from 'src/app/services/auth.service';
import { GenericService } from 'src/app/services/generic.service';
import { HistoryService } from 'src/app/services/history.service';
import { OfferService } from 'src/app/services/offer.service';
import { SearchService } from 'src/app/services/search.service';

import { getEndDate } from 'src/app/utils/end-date-resume';

@Component({
  selector: 'app-search-offers',
  templateUrl: './search-offers.component.html',
  styleUrls: ['./search-offers.component.css'],
})
export class SearchOffersComponent implements OnInit {
  public pageSize: number = 15;
  public current: number = 1;
  public subscriptions: Subscription[] = [];
  public offers: any[] = [];
  public temp: any[] = [];
  public total: number = 0;
  public totalElementByPage = 0;
  public isLoadingTable = false;
  public key: any = {};

  public user: User | undefined;
  public userId: any;

  public validateForm!: FormGroup;

  public selectedValue = 'A';

  public listSubcategory: any = [];
  public listLevelStudy: any = [];
  public listRangeAmount: any = [];
  public listTypeOfJob: any = [];
  public listCategories: any = [];
  public listStates: any = [];

  public isLoadingGeneral: boolean = false;
  categorySelected: number = 1;
  diabled = true;

  public listOffers: any = [];
  public listComments: any = [];

  public userApplications: PostulatesOffer[] = [];
  isLoadingGetTypeJob: boolean = false;

  constructor(
    private genericService: GenericService,
    private readonly meta: Meta,
    private readonly title: Title,
    private fb: FormBuilder,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private router: Router,
    private ngxSpinner: NgxSpinnerService,
    private searchService: SearchService,
    private offerService: OfferService,
    private historyService: HistoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.user = this.authService.getUserFromLocalCache();
      this.userId = this.user.id;
      this.getUserApplications(this.userId);
    }

    this.searchService.getKeyword().subscribe((res: any) => {
      if (this.current >= 1) {
        this.current = 1;
      }

      this.key = res;
      res.title ? (res.title = res.title) : (res.title = '');
      res.subcategory
        ? (res.subcategory = res.subcategory)
        : (res.subcategory = '');
      res.urgency ? (res.urgency = res.urgency) : (res.urgency = '');
      res.levelStudy
        ? (res.levelStudy = res.levelStudy)
        : (res.levelStudy = '');
      res.workPlace ? (res.workPlace = res.workPlace) : (res.workPlace = '');
      res.typeOfJob ? (res.typeOfJob = res.typeOfJob) : (res.typeOfJob = '');
      res.rangeAmount
        ? (res.rangeAmount = res.rangeAmount)
        : (res.rangeAmount = '');
      res.state ? (res.state = res.state) : (res.state = '');

      this.resetFilter();
      this.getListPaginate();
    });

    this.validateForm = this.fb.group({
      title: [''],
      subcategory: [''],
      urgency: [''],
      category: [''],
      typeOfJob: [''],
      rangeAmount: [''],
      state: [''],
    });

    this.getLevelStudy();
    this.getRangeAmount();
    this.getTypeOfJob();
    this.getSubcategories();
    this.getCategories();
    this.getStates();
  }

  public resetFilter() {

    this.validateForm = this.fb.group({
      title: [''],
      subcategory: [''],
      urgency: [''],
      category: [1],
      typeOfJob: [''],
      rangeAmount: [''],
      state: [''],
    });


    this.categorySelected = 1;
  }

  public getListPaginate(): void {

    this.ngxSpinner.show();
    this.isLoadingTable = true;
    this.subscriptions.push(
      this.offerService
        .searchOffersWEB({
          pageNo: this.current - 1,
          pageSize: this.pageSize,
          title: this.key.title,
          urgency: this.key.urgency,
          category: 1,
          subcategory: this.key.subcategory,
          typeOfJob: this.key.typeOfJob,
          rangeAmount: this.key.rangeAmount,
          state: this.key.state,
        })
        .subscribe(
          (response: any) => {
            this.temp = response.content;
            this.offers = response.content;
            this.total = response.totalElements;
            this.totalElementByPage = response.numberOfElements;
            this.onActivate();
            this.isLoadingTable = false;
            this.ngxSpinner.hide();
            this.comparteUserOffers(this.userApplications, this.offers);
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingTable = false;
            this.ngxSpinner.hide();
            this.message.create('error', 'Ha ocurrido un error!');
          }
        )
    );
  }

  changePageSize($event: number): void {
    this.pageSize = $event;
    this.getListPaginate();
  }

  changeCurrentPage($event: number): void {
    this.current = $event;
    this.getListPaginate();
  }

  public filterSubmit() {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }

    if (!this.validateForm.valid) {
      this.createNotification(
        'warning',
        'Es necesario llenar todos los campos!'
      );
      return;
    }

    this.ngxSpinner.show();
    let form = this.validateForm.value;

    this.temp = [];
    this.offers = [];

    this.isLoadingTable = true;
    this.subscriptions.push(
      this.offerService
        .searchOffersWEB({
          pageNo: this.current - 1,
          pageSize: this.pageSize,
          title: form.title ? form.title : '',
          urgency: form.urgency ? form.urgency : '',
          category: 1,
          subcategory: form.subcategory ? form.subcategory : '',
          typeOfJob: form.typeOfJob ? form.typeOfJob : '',
          rangeAmount: form.rangeAmount ? form.rangeAmount : '',
          state: form.state ? form.state : '',
        })
        .subscribe(
          (response: any) => {
            this.temp = response.content;
            this.offers = response.content;
            this.total = response.totalElements;
            this.totalElementByPage = response.numberOfElements;
            this.onActivate();
            this.isLoadingTable = false;
            this.ngxSpinner.hide();
            this.comparteUserOffers(this.userApplications, this.offers);
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingTable = false;
            this.ngxSpinner.hide();
            this.message.create('error', 'Ha ocurrido un error!');
          }
        )
    );
  }

  public getUrgencyColor(item: any): string {
    let urgency = [
      { value: '#E35B5B', id: 'A' },
      { value: 'warning', id: 'B' },
      { value: '#0A7AE9', id: 'C' },
    ];
    let index: any = urgency.find((e: any) => e.id == item);
    return index.value;
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

  public getCategories() {
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.genericService.getAllCategories().subscribe(
        (response: any) => {
          this.listCategories = response;
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

  public getTypeOfJob() {
    this.isLoadingGetTypeJob = true;
    this.subscriptions.push(
      this.genericService.getAllTypeOfJobs().subscribe(
        (response: any) => {
          this.listTypeOfJob = response;
          this.isLoadingGetTypeJob = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingGetTypeJob = false;
          this.message.create('error', errorResponse.error.message);
        }
      )
    );
  }

  onActivate() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
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

  public navigateViewJob(element: any) {
    this.historyService.addtoFavorites(element);

    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/view-job/${element.id}`])
    );
    window.open('#' + url, '_blank');
  }

  public getDays(fecha: any) {
    let r = 1;
    var fechaIni: any = new Date(fecha);
    // Crear objeto de fecha final (actual)
    var fechaFin: any = new Date();
    var diff = fechaFin - fechaIni;

    let diferenciaDias = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diferenciaDias == 0) {
      return 'Hace 1 día';
    }

    if (diferenciaDias == 7) {
      return 'Hace 1 semana';
    }

    if (diferenciaDias != 7 && diferenciaDias != 0) {
      return 'Hace ' + diferenciaDias + ' días';
    }

    return diferenciaDias;
  }

  public getEndDateFunction = (date: any) => getEndDate(date);

  createNotification(type: string, message: string): void {
    this.notification.create(type, 'Upps!', `${message}`, {
      nzPlacement: 'bottomLeft',
    });
  }

  private getUserApplications(userId: number) {
    const userApplicationsString = localStorage.getItem('userApplications');

    if (userApplicationsString) {
      this.userApplications = JSON.parse(userApplicationsString);
      return;
    }

    this.subscriptions.push(
      this.offerService
        .getUserApplications(userId)
        .subscribe((response: PostulatesOffer[]) => {
          localStorage.setItem('userApplications', JSON.stringify(response));
          this.userApplications = response;
        })
    );
  }

  private comparteUserOffers(
    userOffers: PostulatesOffer[],
    allOffers: Offer[]
  ) {
    allOffers.map((offer: Offer) => {
      let index = userOffers.findIndex(
        (userOffer: PostulatesOffer) => offer.id === userOffer.offer.id
      );

      offer.isPostulated = index !== -1;
    });
  }
}
