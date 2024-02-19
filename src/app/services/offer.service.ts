import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Offer } from 'src/app/models/core/offer.model';
import { environment } from 'src/environments/environment';
import { PaginationOffer } from '../models/pagination-offer';
import { PostulatesOffer } from '../models/postulates-offer.model';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  public key: any = {};
  public keyword = new BehaviorSubject<any>({});

  private readonly url: string = `${environment.apiUrl}`;

  constructor(private readonly http: HttpClient) {}

  getKeyword() {
    return this.keyword.asObservable();
  }

  search(k: any) {
    this.key = k;
    this.keyword.next(this.key);
  }

  public createOffer(offer: any): Observable<Offer> {
    return this.http.post<Offer>(`${this.url}/offer/create`, offer);
  }

  public deleteOffer(offerId: number, userId: string): Observable<Offer> {
    return this.http.delete<Offer>(
      `${this.url}/offer/delete/${offerId}/${userId}`
    );
  }

  public editOffer(offer: any): Observable<Offer> {
    return this.http.post<Offer>(`${this.url}/offer/edit`, offer);
  }

  public findOfferById(offerId: any): Observable<any> {
    return this.http.get<any>(`${this.url}/offer/find/${offerId}`);
  }

  public reportOffer(data: any): Observable<Offer> {
    return this.http.post<Offer>(`${this.url}/offer/report-offer`, data);
  }

  public postulate(data: any): Observable<Offer> {
    return this.http.post<Offer>(`${this.url}/postulates/create`, data);
  }

  public getPostulationsByOffer(pagination: any): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        pageNo: pagination.pageNo,
        pageSize: pagination.pageSize,
        offerId: pagination.offerId,
        keyword: pagination.keyword,
      },
    });

    return this.http.get<any>(`${this.url}/postulates/postulates-by-offer-w`, {
      params: params,
    });
  }

  public getComplaintsByOffer(pagination: any): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        pageNo: pagination.pageNo,
        pageSize: pagination.pageSize,
        offerId: pagination.offerId,
        keyword: pagination.keyword,
      },
    });

    return this.http.get<any>(
      `${this.url}/complaint/view-complaints-by-offer`,
      { params: params }
    );
  }

  public searchOffersWEB(pagination: any): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        pageNo: pagination.pageNo,
        pageSize: pagination.pageSize,
        category: pagination.category,
        subcategory: pagination.subcategory,
        title: pagination.title,
        urgency: pagination.urgency,
        typeJob: pagination.typeOfJob,
        rangeAmount: pagination.rangeAmount,
        state: pagination.state,
      },
    });

    return this.http.get<any>(`${this.url}/offer/search-offers-w`, {
      params: params,
    });
  }

  public getAllOffersByUserWEB(pagination: PaginationOffer): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        pageNo: pagination.pageNo,
        pageSize: pagination.pageSize,
        user: pagination.user,
        subcategory: pagination.subcategory,
        title: pagination.title,
        status: pagination.status,
        urgency: pagination.urgency,
        workPlace: pagination.workPlace,
        levelStudy: pagination.levelStudy,
        typeJob: pagination.typeOfJob,
        rangeAmount: pagination.rangeAmount,
      },
    });

    return this.http.get<any>(`${this.url}/offer/view-offer-w`, {
      params: params,
    });
  }

  public getOffers(pagination: any): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        pageNo: pagination.pageNo,
        pageSize: pagination.pageSize,
        keyword: pagination.keyword,
        userId: pagination.userId,
      },
    });

    return this.http.get<any>(`${this.url}/offer/search-offers-copy`, {
      params: params,
    });
  }

  public getOfferByCompany(pagination: any): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        pageNo: pagination.pageNo,
        pageSize: pagination.pageSize,
        company: pagination.company,
      },
    });

    return this.http.get<any>(`${this.url}/offer/search-offers-company`, {
      params: params,
    });
  }

  public selectPostulate(id: any, data: any): Observable<Offer> {
    return this.http.post<Offer>(
      `${this.url}/postulates/change-status/${id}`,
      data
    );
  }

  public responseComplaint(data: any): Observable<Offer> {
    return this.http.post<Offer>(
      `${this.url}/postulates/response-complaint`,
      data
    );
  }

  public messageUSerPostulate(data: any): Observable<Offer> {
    return this.http.post<Offer>(`${this.url}/postulates/message-user`, data);
  }

  public getOfferByUserId(id: any): Observable<Offer> {
    return this.http.get<Offer>(`${this.url}/offer/find-by-user/${id}`);
  }

  public getUserApplications(userId: number): Observable<PostulatesOffer[]> {
    console.log('Se ejecuta la petición de postulaciones de usuario');

    return this.http.get<PostulatesOffer[]>(
      `${this.url}/postulates/find-by-offer-m/${userId}`
    );
  }
}
