import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { HistoryService } from 'src/app/services/history.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  
  
  public searchForm!: FormGroup;
  public listOffers : any = [];


  constructor(
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private ngxSpinner: NgxSpinnerService,
    private searchService: SearchService,
    private historyService: HistoryService
  ) {
    this.searchForm = this.fb.group({
      value: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    
    this.historyService.setProduct(JSON.parse(localStorage.getItem('MyProducts_History') || '[]'));
    this.getProducts();

  }

  public submitForm() {
    if (!this.searchForm.valid) {
      for (const i in this.searchForm.controls) {
        if (this.searchForm.controls.hasOwnProperty(i)) {
          this.searchForm.controls[i].markAsDirty();
          this.searchForm.controls[i].updateValueAndValidity();
        }
      }
      return;
    }

    let form = this.searchForm.value;

    this.searchService.search({
      title: form.value,
      subcategory: null,
      urgency: null,
      category: 1,
      typeOfJob: null,
      rangeAmount: null,
      state: '',
    });

    this.router.navigate(['/search']);
  }

  public searchByKeyword(key : any) {
    this.searchService.search({
      title: key,
      subcategory: null,
      urgency: null,
      category: 1,
      typeOfJob: null,
      rangeAmount: null,
      state: '',
    });

    this.router.navigate(['/search']);
    
  }

  public searchByCategory(key : any) {
    this.searchService.search({
      title: '',
      subcategory: key,
      urgency: null,
      category: null,
      typeOfJob: null,
      rangeAmount: null,
      state: '',
    });

    this.router.navigate(['/search']);
    
  }

  public searchByState(key : any) {
    this.searchService.search({
      title: '',
      subcategory: null,
      urgency: null,
      category: null,
      typeOfJob: null,
      rangeAmount: null,
      state: key,
    });

    this.router.navigate(['/search']);
    
  }

  public getProducts() {
    this.historyService.getProducts().subscribe((res) => {
      this.listOffers = res.slice(0, 5);
    });
  }
}
