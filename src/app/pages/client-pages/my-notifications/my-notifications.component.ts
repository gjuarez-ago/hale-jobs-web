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

@Component({
  selector: 'app-my-notifications',
  templateUrl: './my-notifications.component.html',
  styleUrls: ['./my-notifications.component.css'],
})
export class MyNotificationsComponent implements OnInit {
  public user: User | undefined;
  public userId!: number;
  public subscriptions: Subscription[] = [];
  public isLoadingGeneral = false;

  public loading = false;

  public data: any = [];
  public pageSize: number = 10;
  public current: number = 1;
  public total: number = 0;
  public totalElementByPage = 0;
  public isLoadingTable = false;

  listNotifications: any = [];

  change(): void {
    this.loading = true;
    if (this.data.length > 0) {
      setTimeout(() => {
        this.data = [];
        this.loading = false;
      }, 1000);
    } else {
      setTimeout(() => {
        this.data = [
          {
            title: 'Ant Design Title 1',
          },
          {
            title: 'Ant Design Title 2',
          },
          {
            title: 'Ant Design Title 3',
          },
          {
            title: 'Ant Design Title 4',
          },
        ];
        this.loading = false;
      }, 1000);
    }
  }

  searchForm!: FormGroup;

  constructor(
    private cvService: CVUserService,
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private ngxSpinner: NgxSpinnerService
  ) {
    this.searchForm = this.fb.group({
      title: [null],
    });
  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      this.getNotifications();
      this.userId = this.user.id;
    } else {
      this.router.navigateByUrl('/auth/login');
    }
  }

  getNotifications() {
    this.isLoadingGeneral = true;
    this.cvService
      .getNotificationsByUser({
        email: this.user?.username,
        pageSize: this.pageSize,
        pageNo: this.current - 1,
        title: this.searchForm.value["title"] ? this.searchForm.value["title"] : ''
      })
      .subscribe(
        (response: any) => {
          this.data = response.content;
          this.total = response.totalElements;
          this.totalElementByPage = response.numberOfElements;
          this.ngxSpinner.hide();

          console.log(this.data);

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

  public navigateViewJob(id : any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/view-job/${id}`]));
       window.open('#' + url, '_blank');
  }



  changeCurrentPage($event: number): void {
    this.current = $event;
    this.getNotifications();
  }

  submitForm(): void {
    let form = this.searchForm.value;

    this.isLoadingGeneral = true;

    this.data = [];
    this.totalElementByPage = 0;
    this.total = 0;

    this.cvService
      .getNotificationsByUser({
        email: this.user?.username,
        pageSize: this.pageSize,
        pageNo: this.current - 1,
        title: form.title ? form.title : ''
      })
      .subscribe(
        (response: any) => {
          this.data = response.content;
          this.total = response.totalElements;
          this.totalElementByPage = response.numberOfElements;
          this.ngxSpinner.hide();

          console.log(this.data);

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

  public deleteNotification(id : any) {
    this.isLoadingGeneral = true;
    this.cvService
      .deleteNotification(id)
      .subscribe(
        (response: any) => {
          this.message.create(
            'success',
            'Notificación eliminada correctamente!'
          );
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
}
