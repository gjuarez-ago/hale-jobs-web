import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/core/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: 'app-my-history',
  templateUrl: './my-history.component.html',
  styleUrls: ['./my-history.component.css']
})
export class MyHistoryComponent implements OnInit {


   // Variables globales
  public user: User| undefined;
  public userId :  any;
  public isLoadingGeneral = false;
  
  public listOffers : any = [];

  listOfData: Person[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];

 searchForm!: FormGroup;

  submitForm(): void {
    console.log('submit', this.searchForm.value);
  }

  constructor(
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private ngxSpinner: NgxSpinnerService,
    private historyService : HistoryService,
  ) {
    this.searchForm = this.fb.group({
      keyword: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      this.userId = this.user.id;
      this.historyService.setProduct(JSON.parse(localStorage.getItem('MyProducts_History') || '[]'));
      this.getProducts();
    } else {
      this.router.navigateByUrl("/auth/login");
    }
  }

  public deleteFavorite(item : any) {
    this.listOffers.map((a:any, index:any)=>{
      if(item.id == a.id){
        console.log(item);
        this.listOffers.splice(index,1);
      }
    });

    console.log(this.listOffers);


    this.historyService.removeItem(item);
    this.getProducts();
  }

  public getProducts() {
    this.historyService.getProducts()
    .subscribe(res=>{
      this.listOffers = res;
    });
  }

}


interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}