import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Servicios genericos
  public getAllCountries(): Observable<any> {
    return this.http.get<any>(`${this.url}/country/get-all`)
  }

  public getAllStates(): Observable<any> {
    return this.http.get<any>(`${this.url}/state/list`)
  }

  public getAllCities(key : any): Observable<any> {
    return this.http.get<any>(`${this.url}/city/list-by-state/${key}`)
  }

  public getAllCategories(): Observable<any> {
    return this.http.get<any>(`${this.url}/job-category/get-all`)
  }
  
  public getAllSubcategoriesByCategory(): Observable<any> {
    return this.http.get<any>(`${this.url}/job-subcategory/find-by-category/${1}`)
  }
  
  public getAllRangeAmount(): Observable<any> {
    return this.http.get<any>(`${this.url}/range-amount/get-all`)
  }

  public getAllTypeOfPayments(): Observable<any> {
    return this.http.get<any>(`${this.url}/type-of-payment/get-all`)
  }

  public getAllTypeOfJobs(): Observable<any> {
    return this.http.get<any>(`${this.url}/type-of-job/get-all`)
  }

  public getAllTypeOfLevelStudy(): Observable<any> {
    return this.http.get<any>(`${this.url}/level-study/get-all`)
  }  
  
}
