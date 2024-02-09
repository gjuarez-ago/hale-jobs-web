import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/core/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CVUserService } from 'src/app/services/cv-user.service';
import { GenericService } from 'src/app/services/generic.service';
import { HistoryService } from 'src/app/services/history.service';
import { OfferService } from 'src/app/services/offer.service';

import { minimumAgeValidator } from 'src/app/utils/custom-form-validators';

@Component({
  selector: 'side-menu-rh',
  templateUrl: './side-menu-rh.component.html',
  styleUrls: ['./side-menu-rh.component.css'],
})
export class SideMenuRh implements OnInit {
  public pageSize: number = 10;
  public current: number = 1;
  public subscriptions: Subscription[] = [];
  public total: number = 0;
  public totalElementByPage = 0;
  public listNotications: any[] = [];
  public isLoading = false;

  isCollapsed = false;
  public user: User | undefined;
  public isVisibleSettings = false;
  public isVisibleHistory = false;
  public isVisibleAD = false;

  public editPRofile!: FormGroup;
  public isLoadingGeneral: boolean = false;
  public listHistory: any[] = [];
  userEdit: any;
  public validateForm!: FormGroup;
  searchForm!: FormGroup;
  visiblePsStatusOffer: boolean = false;
  postulateP: any;
  isLoadingPostulates: boolean = false;
  public listSubcategories: any[] = [];
  prefRH: any;
  public psResponseEmailForm!: FormGroup;
  public isLoadingResponse: boolean = false;
  listOffers: any[] = [];
  listADNR: any = 0;
  initials: string = '';

  constructor(
    private authenticationService: AuthService,
    private modal: NzModalService,
    private router: Router,
    private message: NzMessageService,
    private cvService: CVUserService,
    private fb: FormBuilder,
    private ngxSpinner: NgxSpinnerService,
    private historyService: HistoryService,
    private genericService: GenericService,
    private offerService: OfferService
  ) {
    this.searchForm = this.fb.group({
      title: [''],
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

    this.validateForm = this.fb.group({
      actitudesBlandas: [[], [Validators.required]],
      actitudesTecnicas: [[], [Validators.required]],
      areasSpecialidad: [[], [Validators.required]],
      emailContact: ['', [Validators.required, Validators.email]],
      fatherLastName: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required, minimumAgeValidator(18)]],
      gender: ['', [Validators.required]],
      motherLastName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      names: ['', [Validators.required]],
      numberPhone: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      // this.redirect(this.user);
      this.getSubcategories();
      this.getOffers();
      this.getNotifications();
      this.historyService.setNewChange(
        JSON.parse(localStorage.getItem('MyUsersRH_History') || '[]')
      );
      this.getHistory();
      this.getInitials();
    } else {
      this.router.navigateByUrl('/auth/login');
    }
  }

  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['auth/login']);
    this.createMessage('success', 'Has cerrado sesión exitosamente 😀');
  }

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  public getInitials() {
    let nameString =
      this.user?.names +
      ' ' +
      this.user?.motherLastName +
      ' ' +
      this.user?.fatherLastName;
    const fullName = nameString.split(' ');
    const initials = fullName.shift()!.charAt(0) + fullName.pop()!.charAt(0);

    this.initials = initials.toUpperCase();
    return initials.toUpperCase();
  }

  info(): void {
    this.modal.warning({
      nzTitle: '¿Seguro que deseas cerrar sesión?',
      // nzContent: 'Bla bla ...',
      nzOkText: 'OK',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.onLogOut();
      },
    });
  }

  public toGoMyProfile() {
    if (this.user?.typeOfUser == 1) {
      this.router.navigateByUrl('/profile/cv');
    } else {
      this.router.navigateByUrl('/dashboard/statisticts');
    }
  }

  redirect(data: any) {
    if (data.profileCompleted) {
      switch (data.role) {
        case 'ROLE_USER':
          this.router.navigateByUrl('/profile/cv');
          break;
        case 'ROLE_HR':
          this.router.navigateByUrl('/dashboard/statisticts');
          break;
        case 'ROLE_ADMIN':
          this.router.navigateByUrl('/dashboard/statisticts');
          break;
        default:
          // alert("El usuario no tiene un rol en estos momentos")
          break;
      }
    } else {
      switch (data.role) {
        case 'ROLE_USER':
          this.router.navigateByUrl('/register/user');
          break;
        case 'ROLE_HR':
          this.router.navigateByUrl('/register/recruiter');
          break;
        case 'ROLE_ADMIN':
          this.router.navigateByUrl('/register/recruiter');
          break;
        default:
          // alert("El usuario no tiene un rol en estos momentos")
          break;
      }
    }
  }

  public showModalSettings() {
    this.isVisibleSettings = true;
    this.getUserEdit();
    this.getPreferencesRH();
  }

  public showModalAD() {
    this.changeStatusNotification();
    this.getNotifications();
    this.isVisibleAD = true;
  }

  public showModalHistory() {
    this.getHistory();
    this.isVisibleHistory = true;
  }

  public closeModalSettings() {
    this.isVisibleSettings = false;
  }

  public closeModalAD() {
    this.getNotifications();
    this.isVisibleAD = false;
  }

  public closeModalHistory() {
    this.isVisibleHistory = false;
  }

  getHistory() {
    this.historyService.setNewChange(
      JSON.parse(localStorage.getItem('MyUsersRH_History') || '[]')
    );
    this.isLoadingPostulates = true;
    this.historyService.getHistory().subscribe((res) => {
      console.log(this.listHistory);
      this.listHistory = res;
    });
    this.isLoadingPostulates = false;
  }

  getNotifications() {
    this.isLoadingGeneral = true;
    this.cvService
      .getNotificationsByUser({
        email: this.user?.username,
        pageSize: this.pageSize,
        pageNo: this.current - 1,
        title: this.searchForm.value['title']
          ? this.searchForm.value['title']
          : '',
      })
      .subscribe(
        (response: any) => {
          this.listNotications = response.content;
          this.total = response.totalElements;
          this.totalElementByPage = response.numberOfElements;
          this.isLoading = false;
          this.ngxSpinner.hide();

          this.listADNR = this.listNotications.filter(
            (e: any) => e.status == 0
          ).length;
          this.isLoadingGeneral = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.message.create(
            'error',
            'Ha ocurrido un error al recuperar los estados'
          );
          this.isLoadingGeneral = false;
        }
      );
  }

  changePageSize($event: number): void {
    this.pageSize = $event;
    this.getNotifications();
  }

  public navigateViewJob(id: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/dashboard/view-worker/${id}`])
    );
    window.open('#' + url, '_blank');
  }

  public navigateViewOffer(id: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/view-job/${id}`])
    );
    window.open('#' + url, '_blank');
  }

  changeCurrentPage($event: number): void {
    this.current = $event;
    this.getNotifications();
  }

  submitForm(): void {
    let form = this.searchForm.value;

    this.isLoadingGeneral = true;
    this.cvService
      .getNotificationsByUser({
        email: this.user?.username,
        pageSize: this.pageSize,
        pageNo: this.current - 1,
        title: form.title ? form.title : '',
      })
      .subscribe(
        (response: any) => {
          this.listNotications = response.content;
          this.total = response.totalElements;
          this.totalElementByPage = response.numberOfElements;
          this.isLoading = false;
          this.ngxSpinner.hide();

          console.log(this.listNotications);

          this.isLoadingGeneral = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.message.create(
            'error',
            'Ha ocurrido un error al realizar la búsqueda'
          );
          this.isLoadingGeneral = false;
        }
      );
  }

  public sanitazerURL(value: any) {
    if (value) {
      return value;
    }

    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrbkK5L2pzoJpQgvTgwYZlBQigM0rsd2kC8oW3lk-7tQ&s';
  }

  public deleteNotification(id: any) {
    this.isLoadingGeneral = true;
    this.cvService.deleteNotification(id).subscribe(
      (response: any) => {
        this.message.create('success', 'Notificación eliminada correctamente!');
        this.getNotifications();
        this.ngxSpinner.hide();
        this.isLoadingGeneral = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al realizar la búsqueda'
        );
        this.isLoadingGeneral = false;
      }
    );
  }

  public deleteFavorite(item: any) {
    this.historyService.removeChange(item);
    this.historyService.setNewChange(
      JSON.parse(localStorage.getItem('MyUsersRH_History') || '[]')
    );

    if (this.listHistory.length == 0) {
      this.closeModalHistory();
    }

    this.getHistory();
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

    this.isLoadingGeneral = true;
    let form = this.psResponseEmailForm.value;

    this.ngxSpinner.show();
    this.subscriptions.push(
      this.offerService
        .messageUSerPostulate({
          ...form,
          offerId: form.offer,
          status: 0,
          userId: this.postulateP.id,
        })
        .subscribe(
          (response: any) => {
            this.getNotifications();
            this.ngxSpinner.hide();
            this.closeModalMessagePostulate();
            this.createMessage('success', 'Mensaje enviado :)');
            this.psResponseEmailForm.reset();
            this.isLoadingGeneral = false;
          },
          (errorResponse: HttpErrorResponse) => {
            this.ngxSpinner.hide();
            this.isLoadingGeneral = false;
            this.message.create('error', errorResponse.error.message);
          }
        )
    );
  }

  public getUserEdit() {
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.authenticationService.getCurrentUser(this.user?.username).subscribe(
        (response: any) => {
          this.userEdit = response;
          this.isLoadingGeneral = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingGeneral = false;
          this.message.create('error', errorResponse.error.message);
        }
      )
    );
  }

  public getPreferencesRH() {
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.cvService.getPreferencesRH(this.user?.id).subscribe(
        (response: any) => {
          this.prefRH = response;
          this.isLoadingGeneral = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingGeneral = false;
          this.message.create('error', errorResponse.error.message);
        }
      )
    );
  }

  public saveSettings() {
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

    let form = this.validateForm.value;

    console.log(form);

    this.isLoadingGeneral = true;
    this.cvService
      .updatePreferencesRH({ ...form, id: this.user?.id })
      .subscribe(
        (response: any) => {
          this.message.create(
            'success',
            '¡Preferencias actualizada correctamente!'
          );
          this.closeModalSettings();
          this.isLoadingGeneral = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingGeneral = false;
          this.message.create(
            'error',
            'Ha ocurrido un error al recuperar los municipios'
          );
        }
      );
  }

  getSubcategories() {
    this.isLoadingGeneral = true;
    this.genericService.getAllSubcategoriesByCategory().subscribe(
      (response: any) => {
        this.listSubcategories = response.map((prop: any, key: any) => {
          return {
            ...prop,
            key: key + 1,
          };
        });
        this.isLoadingGeneral = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.isLoadingGeneral = false;
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar los municipios'
        );
      }
    );
  }

  //VALIDACIÓN DE INPUT DE TELEFONO PARA NO ACEPTAR LETRAS
  validateFormat(event: any) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
    if (!regex.test(key)) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  }

  public changeStatusNotification() {
    this.isLoadingGeneral = true;
    this.cvService.changeStatusNotification(this.user?.username).subscribe(
      (response: any) => {
        this.isLoadingGeneral = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al actualizar las notificiaciones'
        );
        this.isLoadingGeneral = false;
      }
    );
  }

  getOffers() {
    this.isLoadingGeneral = true;
    this.offerService.getOfferByUserId(this.user?.id).subscribe(
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
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar las ofertas'
        );
        this.isLoadingGeneral = false;
      }
    );
  }

  public attitudes: any = [
    {
      idAttitude: 1,
      attitudeName: 'Dominio de un idioma extranjero',
    },
    {
      idAttitude: 2,
      attitudeName: 'Un título o certificado',
    },
    {
      idAttitude: 3,
      attitudeName: 'Escritura formal',
    },
  ];

  public technicalAttitudes: any = [
    {
      id: 1,
      name: 'Manejo de hojas de cálculo',
    },
    {
      id: 2,
      name: 'Uso de programas de edición fotográfica',
    },
    {
      id: 3,
      name: 'Redacción de textos',
    },
    {
      id: 4,
      name: 'Java',
    },
    {
      id: 5,
      name: 'Programación orientada objetos',
    },
    {
      id: 6,
      name: 'C#',
    },
    {
      id: 7,
      name: 'C++',
    },
    {
      id: 8,
      name: 'AWS Services',
    },
    {
      id: 9,
      name: 'Azure Devops',
    },
    {
      id: 10,
      name: 'Google Cloud',
    },
    {
      id: 11,
      name: 'C',
    },
    {
      id: 12,
      name: 'Ruby and Rails',
    },
    {
      id: 13,
      name: 'Python',
    },
    {
      id: 14,
      name: '.Net Core',
    },
    {
      id: 15,
      name: 'Angular',
    },
    {
      id: 16,
      name: 'React.js',
    },
    {
      id: 17,
      name: 'Next.js',
    },
    {
      id: 18,
      name: 'MySQL',
    },
    {
      id: 19,
      name: 'SQL Server',
    },
    {
      id: 20,
      name: 'RxJS',
    },
    {
      id: 21,
      name: 'Linux',
    },
    {
      id: 23,
      name: 'PLSQL-Oracle',
    },
    {
      id: 24,
      name: 'SQLite',
    },
    {
      id: 25,
      name: 'Git',
    },
    {
      id: 26,
      name: 'Spring Boot',
    },
    {
      id: 27,
      name: 'Spring Framework',
    },
    {
      id: 28,
      name: 'Servicios Rest',
    },
    {
      id: 29,
      name: 'Microservicios',
    },
    {
      id: 30,
      name: 'Servicios SOAP',
    },
  ];
}
