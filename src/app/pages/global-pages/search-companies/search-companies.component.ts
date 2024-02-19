import { HttpErrorResponse } from '@angular/common/http';
import { AfterContentChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/core/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-search-companies',
  templateUrl: './search-companies.component.html',
  styleUrls: ['./search-companies.component.css']
})
export class SearchCompaniesComponent implements OnInit  {

  public companies : any[] = [];
  public pageSize: number = 12;
  public current: number = 1;
  public subscriptions: Subscription[] = [];
  public temp : any[] = [];
  public total: number = 0;
  public totalElementByPage = 0;
  public isLoadingTable = false;
  public key : any = {};

  public user: User| undefined;
  public userId : any;

  public validateForm!: FormGroup;
  
  constructor(
    private readonly meta: Meta,
    private readonly title: Title,
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private notification: NzNotificationService,
    private ngxSpinner: NgxSpinnerService,
    private companyService : CompanyService
    ) {

      this.validateForm = this.fb.group({
        name: [null]
      });
  

  }
  

  ngOnInit(): void {

    this.title.setTitle('Búsqueda por empresa')
    this.meta.addTags(
      [
        { name: 'description', content: '' }
      ]
    )

    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      this.userId = this.user.id;
      this.getCompaniesGeneral();
    } else {
      this.router.navigateByUrl("/auth/login");
    }


  }

  submitForm() {

    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
  
    this.companies = [];
    this.total = 0;
  

    this.ngxSpinner.show();
    let form = this.validateForm.value;

    this.isLoadingTable = true;
    this.subscriptions.push(
      this.companyService.getCompaniesGeneral(
        {
          pageNo: this.current - 1,
          pageSize: this.pageSize,
          name: form.name ? form.name : '',
        }
      ).subscribe(
        (response: any) => {
          this.temp = response.content;
          this.companies = response.content;
          this.total = response.totalElements;
          this.totalElementByPage = response.numberOfElements;
          this.isLoadingTable = false;
          this.ngxSpinner.hide();
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingTable = false;
          this.ngxSpinner.hide();
          this.message.create("error",  "Ha ocurrido un error!");
        }
      )
    );


  }

  private getCompaniesGeneral() {

    console.log(this.validateForm.value);
    
    this.ngxSpinner.show();
    this.isLoadingTable = true;
    this.subscriptions.push(
      this.companyService.getCompaniesGeneral(
        {
          pageNo: this.current - 1,
          pageSize: this.pageSize,
          name: this.validateForm.value["name"] ? this.validateForm.value["name"] : '',
        }
      ).subscribe(
        (response: any) => {

                    
          this.temp = response.content;
          this.companies = response.content;
          this.total = response.totalElements;
          this.totalElementByPage = response.numberOfElements;
          this.isLoadingTable = false;
          this.ngxSpinner.hide();
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingTable = false;
          this.ngxSpinner.hide();
          this.message.create("error",  "Ha ocurrido un error!");
        }
      )
    );

  }

  changePageSize($event: number) : void {
    console.log("Change page size: "  + $event);
    this.pageSize = $event;
    this.getCompaniesGeneral();
  }

   changeCurrentPage($event: number) : void {
    this.current = $event;
    this.getCompaniesGeneral();
   }



  createNotification(type: string, message: string): void {
    this.notification.create(
      type,
      'Upps!',
      `${message}`,
      { nzPlacement: 'bottomLeft' }
    );
  }


}
