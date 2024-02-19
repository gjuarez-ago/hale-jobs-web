import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/core/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';
import { GenericService } from 'src/app/services/generic.service';
import { OfferService } from 'src/app/services/offer.service';

import { getEndDate } from 'src/app/utils/end-date-resume';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rh-offers',
  templateUrl: './rh-offers.component.html',
  styleUrls: ['./rh-offers.component.css'],
})
export class RhOffersComponent implements OnInit {
  private readonly url: string = `${environment.appUrl}`;

  confirmDeleteModal?: NzModalRef; // For testing by now

  public selectedValue: any;

  // * Variables de la tabla
  public pageSize: number = 10;
  public current: number = 1;
  public subscriptions: Subscription[] = [];
  public total: number = 0;
  public totalElementByPage = 0;
  public offers: any[] = [];

  public pageSizePs: number = 10;
  public currentPs: number = 1;
  public totalPs: number = 0;
  public totalElementByPagePs = 0;
  public dataPs: any[] = [];

  public pageSizeC: number = 10;
  public currentC: number = 1;
  public totalC: number = 0;
  public totalElementByPageC = 0;
  public dataC: any[] = [];

  public user: User | undefined;
  public userId: any;

  //  public data : Content[] = [];
  //  public temp : Content[] = [];
  public isLoadingTable = false;

  // * Variables para visualizar la orden

  public visibleModal = false;
  public isLoadingModal = false;

  // * Variables genericas
  public isLoadingGeneral = false;
  public dateFormat = 'yyyy/MM/dd';
  public statusOffer = '0';

  public listSubcategory: any = [];
  public listLevelStudy: any = [];
  public listRangeAmount: any = [];
  public listTypeOfJob: any = [];

  // * Variables para editar un usuario
  @ViewChild('e') editNgForm: NgForm | undefined;
  public editForm!: FormGroup;
  public visibleEditDrawer = false;
  public isLoadingEditDrawer = false;
  public currentUsername: string | undefined = '';

  // * Variables para realizar el filtrado
  public validateForm!: FormGroup;
  offer: any;
  isLoadingViewDetail: boolean = false;
  isLoadingPostulates: boolean = false;

  public visiblePsEmail: boolean = false;
  public visiblePsStatusOffer: boolean = false;
  public visibleResponseComplaint: boolean = false;

  public psResponseEmailForm!: FormGroup;
  public responseComplaintForm!: FormGroup;
  isLoadingResponse: boolean = false;
  postulateP: any;
  public listCompanies: any[] = [];

  constructor(
    private companyService: CompanyService,
    private genericService: GenericService,
    private authenticationService: AuthService,
    private offerService: OfferService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private ngxSpinner: NgxSpinnerService,
    private notificationService: NzNotificationService
  ) {
    this.isLoadingGeneral = false;

    this.validateForm = this.fb.group({
      title: [''],
      subcategory: [''],
      urgency: [''],
      levelStudy: [''],
      workPlace: [''],
      status: [0],
      typeOfJob: [''],
      rangeAmount: [''],
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
    });

    this.responseComplaintForm = this.fb.group({
      comments: [
        '',
        [
          Validators.required,
          Validators.maxLength(250),
          Validators.minLength(10),
        ],
      ],
    });
  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      this.userId = this.user.id;
      this.getLevelStudy();
      this.getRangeAmount();
      this.getTypeOfJob();
      this.getSubcategories();
      this.getCompaniesByUser(this.userId);
    } else {
      this.router.navigateByUrl('/auth/login');
    }

    this.loader();
  }

  public cleanFilters() {
    this.validateForm = this.fb.group({
      title: [''],
      subcategory: [''],
      urgency: [''],
      levelStudy: [''],
      workPlace: [''],
      status: ['0'],
      typeOfJob: [''],
      rangeAmount: [''],
    });
  }

  public loader() {
    this.ngxSpinner.show();

    setTimeout(() => {
      this.ngxSpinner.hide();
    }, 800);
  }

  public navigateViewJob(element: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/dashboard/view-worker/${element.username}`])
    );
    window.open('#' + url, '_blank');
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }

    if (!this.validateForm.valid) {
      this.createMessage('warning', 'Es necesario llenar todos los campos!');
      return;
    }

    this.ngxSpinner.show();
    let form = this.validateForm.value;

    this.offers = [];
    this.total = 0;

    this.isLoadingTable = true;
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.offerService
        .getAllOffersByUserWEB({
          pageNo: this.current - 1,
          pageSize: this.pageSize,
          user: this.userId,
          subcategory: form.subcategory ? form.subcategory : '',
          title: form.title ? form.title : '',
          status: form.status,
          urgency: form.urgency ? form.urgency : '',
          workPlace: form.workPlace ? form.workPlace : '',
          levelStudy: form.levelStudy ? form.levelStudy : '',
          typeOfJob: form.typeOfJob ? form.typeOfJob : '',
          rangeAmount: form.rangeAmount ? form.rangeAmount : '',
        })
        .subscribe(
          (response: any) => {
            this.offers = response.content;
            this.total = response.totalElements;
            this.totalElementByPage = response.numberOfElements;

            this.isLoadingGeneral = false;
            this.isLoadingTable = false;
            this.loader();
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingTable = false;
            this.isLoadingGeneral = false;
            this.message.create('error', errorResponse.error.message);
            this.ngxSpinner.hide();
          }
        )
    );
  }

  changePageSize($event: number): void {
    this.pageSize = $event;
    this.getOffers();
  }

  changeCurrentPage($event: number): void {
    this.current = $event;
    this.getOffers();
  }

  public navigateCreate() {
    if (this.listCompanies.length == 0 && this.offers.length == 0) {
      this.router.navigateByUrl('/dashboard/new-company');
    } else {
      this.router.navigateByUrl('/dashboard/new-offer');
    }
  }

  getPostulatesByOffer(): void {
    this.ngxSpinner.show();
    this.isLoadingPostulates = true;
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.offerService
        .getPostulationsByOffer({
          pageNo: this.currentPs - 1,
          pageSize: this.pageSizePs,
          offerId: this.offer.id,
          keyword: '',
        })
        .subscribe(
          (response: any) => {
            this.dataPs = response.content.map((prop: any, key: any) => {
              return {
                ...prop,
                valueSelected: 0,
              };
            });

            this.totalPs = response.totalElements;
            this.totalElementByPagePs = response.numberOfElements;
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
    );
  }

  changePageSizePs($event: number): void {
    this.pageSizePs = $event;
    this.getPostulatesByOffer();
  }

  changeCurrentPagePs($event: number): void {
    this.currentPs = $event;
    this.getPostulatesByOffer();
  }

  public getCompaniesByUser(ele: any) {
    this.isLoadingGeneral = true;
    this.ngxSpinner.show();
    this.subscriptions.push(
      this.companyService.getCompaniesByOwnerWP(ele).subscribe(
        (response: any) => {
          this.listCompanies = response;
          this.isLoadingGeneral = false;
          this.getOffers();
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingGeneral = false;
          this.message.create('error', errorResponse.error.message);
        }
      )
    );
  }

  getComplaintsByOffer(): void {
    this.ngxSpinner.show();
    this.isLoadingTable = true;
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.offerService
        .getComplaintsByOffer({
          pageNo: this.currentC - 1,
          pageSize: this.pageSizeC,
          offerId: this.offer.id,
          keyword: '',
        })
        .subscribe(
          (response: any) => {
            this.dataC = response.content;
            this.totalC = response.totalElements;
            this.totalElementByPageC = response.numberOfElements;
            this.isLoadingGeneral = false;
            this.isLoadingTable = false;
            this.loader();
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingTable = false;
            this.isLoadingGeneral = false;
            this.message.create('error', errorResponse.error.message);
            this.ngxSpinner.hide();
          }
        )
    );
  }

  changePageSizeC($event: number): void {
    this.pageSizeC = $event;
    this.getComplaintsByOffer();
  }

  changeCurrentPageC($event: number): void {
    this.currentC = $event;
    this.getComplaintsByOffer();
  }

  openCreateDrawer() {}

  openEditDrawer() {
    this.visibleEditDrawer = true;
  }
  closeEditDrawer() {
    this.visibleEditDrawer = false;
  }

  openViewModal(item: any) {
    this.getOfferById(item.id);
    this.visibleModal = true;
  }

  shareOffer(item: any) {
    const areaTmp = document.createElement('textarea');
    areaTmp.value = `${this.url}/view-job/${item.id}`;
    document.body.appendChild(areaTmp);
    areaTmp.select();
    document.execCommand('copy');
    document.body.removeChild(areaTmp);
    this.notificationService.blank(
      'Compartir',
      'Se ha copiado el link en el portapapeles.',
      { nzPlacement: 'topLeft' }
    );
  }

  public sanitazerURL(value: any) {
    if (value) {
      return value;
    }

    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrbkK5L2pzoJpQgvTgwYZlBQigM0rsd2kC8oW3lk-7tQ&s';
  }

  closeViewModal() {
    this.visibleModal = false;
  }

  showDeleteModal(offer: any): void {
    this.confirmDeleteModal = this.modal.confirm({
      nzTitle: '¿Seguro que deseas eliminar esta oferta?',
      nzContent:
        'Al ser eliminada esta oferta, no podrá ser visible para los candidatos dentro de la búsqueda general, más sin embargo si dentro de tus ofertas con estatus "cerrada"',
      nzOnOk: () => this.deleteOffer(offer),
    });
  }

  public deleteOffer(id: any) {
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.offerService.deleteOffer(id, this.userId).subscribe(
        (response: any) => {
          this.isLoadingGeneral = false;
          this.getOffers();
          this.message.create('success', 'Oferta eliminada correctamente');
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

  public getOfferById(id: any) {
    this.isLoadingViewDetail = true;
    this.ngxSpinner.show();
    this.subscriptions.push(
      this.offerService.findOfferById(id).subscribe(
        (response: any) => {
          this.offer = response;
          this.isLoadingViewDetail = false;
          this.getPostulatesByOffer();
          this.getComplaintsByOffer();
          this.ngxSpinner.hide();
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingViewDetail = false;
          this.ngxSpinner.hide();
          this.message.create('error', errorResponse.error.message);
        }
      )
    );
  }

  getOffers() {
    this.isLoadingTable = true;
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.offerService
        .getAllOffersByUserWEB({
          pageNo: this.current - 1,
          pageSize: this.pageSize,
          user: this.userId,
          subcategory: this.validateForm.value['subcategory']
            ? this.validateForm.value['subcategory']
            : '',
          title: this.validateForm.value['title']
            ? this.validateForm.value['title']
            : '',
          status: this.validateForm.value['status'],
          urgency: this.validateForm.value['urgency']
            ? this.validateForm.value['urgency']
            : '',
          workPlace: this.validateForm.value['workPlace']
            ? this.validateForm.value['workPlace']
            : '',
          levelStudy: this.validateForm.value['levelStudy']
            ? this.validateForm.value['levelStudy']
            : '',
          typeOfJob: this.validateForm.value['typeOfJob']
            ? this.validateForm.value['typeOfJob']
            : '',
          rangeAmount: this.validateForm.value['rangeAmount']
            ? this.validateForm.value['rangeAmount']
            : '',
        })
        .subscribe(
          (response: any) => {
            this.offers = response.content;
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

  sendStatusPostulate(data: any): void {
    this.modal.warning({
      nzTitle: '¿Seguro que deseas responder?',
      // nzContent: 'Bla bla ...',
      nzOkText: 'OK',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.changeStatusPostulate(data);
      },
    });
  }

  public changeStatusPostulate(e: any) {
    let data = {
      status: e.valueSelected,
      userId: this.userId,
    };

    console.log(e);

    this.ngxSpinner.show();
    this.subscriptions.push(
      this.offerService.selectPostulate(e.id, data).subscribe(
        (response: any) => {
          this.isLoadingViewDetail = false;
          this.getPostulatesByOffer();
          this.getComplaintsByOffer();
          this.ngxSpinner.hide();
          this.message.create(
            'success',
            'Cambio de estatus realizado correctamente 😃'
          );
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingViewDetail = false;
          this.ngxSpinner.hide();
          this.message.create('error', errorResponse.error.message);
        }
      )
    );
  }

  public showModalMessagePostulate(item: any) {
    console.log(item);
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
      this.offerService
        .messageUSerPostulate({
          ...form,
          offerId: this.postulateP.offer.id,
          status: 0,
          userId: this.postulateP.user.id,
        })
        .subscribe(
          (response: any) => {
            this.getPostulatesByOffer();
            this.getComplaintsByOffer();
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

  public showModalResponseComplaint() {
    this.visibleResponseComplaint = true;
  }

  public closeModalResponseComplaint() {
    this.visibleResponseComplaint = false;
  }

  public submitResponseComplaint() {
    if (!this.responseComplaintForm.valid) {
      for (const i in this.responseComplaintForm.controls) {
        if (this.responseComplaintForm.controls.hasOwnProperty(i)) {
          this.responseComplaintForm.controls[i].markAsDirty();
          this.responseComplaintForm.controls[i].updateValueAndValidity();
        }
      }
      this.createMessage('warning', 'Es necesario llenar todos los campos!');
      return;
    }

    this.isLoadingResponse = true;
    let form = this.responseComplaintForm.value;

    this.ngxSpinner.show();
    this.subscriptions.push(
      this.offerService.responseComplaint({ ...form }).subscribe(
        (response: any) => {
          this.offer = response;
          this.getPostulatesByOffer();
          this.getComplaintsByOffer();
          this.ngxSpinner.hide();
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

  public getUrgencyColor(item: any): string {
    let urgency = [
      { value: 'error', id: 'A' },
      { value: 'warning', id: 'B' },
      { value: 'processing', id: 'C' },
    ];
    let index: any = urgency.find((e: any) => e.id == item);
    return index.value;
  }

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  public showValues(item: any): string {
    if ((item = 'A')) {
      return 'Mostrar';
    }
    return 'No mostrar';
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
      { value: 'Urgente', id: 'A' },
      { value: 'Moderada', id: 'B' },
      { value: 'Baja', id: 'C' },
    ];
    let index: any = urgency.find((e: any) => e.id == item);
    return index.value;
  }

  public getEndDateFunction = (date: any) => getEndDate(date);
}

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}
