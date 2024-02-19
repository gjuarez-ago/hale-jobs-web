import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/core/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CVUserService } from 'src/app/services/cv-user.service';

@Component({
  selector: 'app-my-postulations',
  templateUrl: './my-postulations.component.html',
  styleUrls: ['./my-postulations.component.css'],
})
export class MyPostulationsComponent implements OnInit {
  
  public user: User | undefined;
  public userId!: number;
  public subscriptions: Subscription[] = [];
  public isLoadingGeneral = false;

  public data: any = [];
  public pageSize: number = 10;
  public current: number = 1;
  public total: number = 0;
  public totalElementByPage = 0;
  public isLoadingTable = false;

  public searchForm!: FormGroup;
  public listPostulations: any;

  submitForm(): void {
    let form = this.searchForm.value;

    this.isLoadingTable = true;
    this.cvService
      .getPostulationsByUser({
        userId: this.userId,
        keyword: form.keyword ? form.keyword : '',
        pageSize: this.pageSize,
        pageNo: this.current - 1,
      })
      .subscribe(
        (response: any) => {
          this.listPostulations = response.content;
          this.total = response.totalElements;
          this.totalElementByPage = response.numberOfElements;
          this.isLoadingTable = false;
          this.ngxSpinner.hide();

          console.log(this.listPostulations);

          this.isLoadingGeneral = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.ngxSpinner.hide();
          this.message.create(
            'error',
            'Ha ocurrido un error al recuperar las postulaciones'
          );
          this.isLoadingGeneral = false;
        }
      );
  }

  constructor(
    private cvService: CVUserService,
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private ngxSpinner: NgxSpinnerService
  ) {
    this.searchForm = this.fb.group({
      keyword: [''],
    });
  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      this.userId = this.user.id;
      this.getPostulations();
    } else {
      this.router.navigateByUrl('/auth/login');
    }
  }

  getPostulations() {
    this.isLoadingTable = true;
    this.cvService
      .getPostulationsByUser({
        userId: this.userId,
        keyword: this.searchForm.value[''] ? this.searchForm.value[''] : '',
        pageSize: this.pageSize,
        pageNo: this.current - 1,
      })
      .subscribe(
        (response: any) => {
          this.listPostulations = response.content;
          this.total = response.totalElements;
          this.totalElementByPage = response.numberOfElements;
          this.isLoadingTable = false;
          this.ngxSpinner.hide();

          console.log(this.listPostulations);

          this.isLoadingTable = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.ngxSpinner.hide();
          this.message.create(
            'error',
            'Ha ocurrido un error al recuperar las postulaciones'
          );
          this.isLoadingTable = false;
        }
      );
  }

  removePostulation() {
    this.isLoadingGeneral = true;
    this.cvService.deletePostulationsByUser(1).subscribe(
      (response: any) => {
        this.message.create('success', 'Ya no formas parte de este proceso!');
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
    this.getPostulations();
  }

  changeCurrentPage($event: number): void {
    this.current = $event;
    this.getPostulations();
  }

  getStatus(item: any) {
    let stautusList = [
      { value: 'Pendiente', id: 0 },
      { value: 'Seleccionado', id: 1 },
      { value: 'No Seleccionado', id: 2 },
    ];
    let index: any = stautusList.find((e: any) => e.id == item);
    return index.value;
  }

  getStatusColor(item: any) {
    let stautusList = [
      { value: 'Primary', id: 0 },
      { value: 'success', id: 1 },
      { value: 'danger', id: 2 },
    ];
    let index: any = stautusList.find((e: any) => e.id == item);
    return index.value;
  }
}

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}
