import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RHUserService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Servicio para obtener todas las ofertas por usuario
  public getOffersByUser(params : any): Observable<any> {
    return this.http.get<any>(`${this.url}/offer/get-by-user?userId=${params}`);
  }

  // Servicio para obtener todas la oferta por ID
    public getOffersByID(id : any): Observable<any> {
    return this.http.get<any>(`${this.url}/offer/get-by-user?userId=${id}`);
  }
  
  // Servicio para actualizar la oferta
  public updateOfferByID(id : any, data : any): Observable<any> {
    return this.http.post<any>(`${this.url}/offer/update/${id}`, data);
  }

  // Servicio para retirar la oferta
  public deleteExperiencesById(id : any): Observable<any> {
    return this.http.delete<any>(`${this.url}/offer/delete/${id}`);
  }

  // Servicio para crear la oferta
  public createOffer(offer : any) : Observable<any> {
    return this.http.post<any>(`${this.url}/offer/create`, offer);
  }

  // Servicio para visualizar mis empresas

  // Servicio para ver el detalle de una empresa por ID




}