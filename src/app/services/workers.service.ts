import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PaginationOffer } from '../models/pagination-offer';

@Injectable({
  providedIn: 'root'
}) 
export class WorkersService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getAllOffersByUserWEB(pagination : any): Observable<any> {

    const params = new HttpParams({
      fromObject: {
        pageNo: pagination.pageNo,
        pageSize: pagination.pageSize,
        city: pagination.city,
        jobTitle: pagination.jobTitle,
        mod: pagination.mod,
        salary: pagination.salary,
        speciality: pagination.speciality,
        state: pagination.state
      }
    });

    return this.http.get<any>(`${this.url}/user/search-rh`,{params: params})
  }

}