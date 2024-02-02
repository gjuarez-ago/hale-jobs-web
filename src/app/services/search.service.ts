import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public key : any = {};
  public keyword = new BehaviorSubject<any>({});  
  
  constructor() { }

  getKeyword(){
    return this.keyword.asObservable();
  }
  
  search(k: any) {
     this.key = k;
     this.keyword.next(this.key);
  }
  

}