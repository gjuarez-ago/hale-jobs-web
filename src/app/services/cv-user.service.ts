import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/core/user.model';
import { environment } from 'src/environments/environment';
import { WorkExperiences } from '../models/core/work-experiences.model';

@Injectable({
  providedIn: 'root'
})
export class CVUserService {

  private readonly url: string = `${environment.apiUrl}`

  constructor(private readonly http: HttpClient) { }

   public updateImage(image : File, user : any): Observable<User> {
    
    const formData = new FormData();
    formData.append("image", image);
    formData.append("username", user);
    
    return this.http.post<User>(`${this.url}/user/update-profile-image`, formData);
  }

  public updateCVBasic(image : any): Observable<User> {
    return this.http.post<User>(`${this.url}/user/update-cv-basic`, image);
  }

  public updateCVPrincipal(image : any): Observable<User> {
    return this.http.post<User>(`${this.url}/user/update-cv-principal`, image);
  }

  public changePublicProfile(data : any)  : Observable<User> {
    return this.http.post<User>(`${this.url}/user/change-visibility`, data);
  }

  public workExperiencesByUser(user : any): Observable<any> {
    return this.http.get<any>(`${this.url}/work-experiences/get-by-user?userId=${user}`);
  }

  public workExperiencesById(user : any): Observable<any> {
    return this.http.get<any>(`${this.url}/work-experiences/find/${user}`);
  }

  public deleteExperiencesById(workExperienceId : any): Observable<WorkExperiences> {
    return this.http.delete<WorkExperiences>(`${this.url}/work-experiences/delete/${workExperienceId}`);
  }

  public updateExperienceByUser(id:any, workExperience : any): Observable<WorkExperiences> {
    return this.http.post<WorkExperiences>(`${this.url}/work-experiences/update/${id}`, workExperience);
  }

  public addWorkExperience(workExperience : any): Observable<WorkExperiences> {
    return this.http.post<WorkExperiences>(`${this.url}/work-experiences/create`, workExperience);
  }

  public getSkillsByUser(user : any): Observable<WorkExperiences> {
    return this.http.get<WorkExperiences>(`${this.url}/skills/get-by-user?userId=${user}`);
  }

  public deleteSkillsByUser(user : any): Observable<any> {
    return this.http.delete<any>(`${this.url}/skills/delete/${user}`);
  }

  public addSkills(skill : any): Observable<any> {
    return this.http.post<any>(`${this.url}/skills/create`, skill);
  }

  public getSchoolsByUser(user : any): Observable<any> {
    return this.http.get<any>(`${this.url}/school/get-by-user?userId=${user}`);
  }

  public getSchoolsById(schoolId : any): Observable<any> {
    return this.http.get<any>(`${this.url}/school/find/${schoolId}`);
  }

  public addSchoolExperience(school : any): Observable<any> {
    return this.http.post<any>(`${this.url}/school/create`, school);
  }

  public deleteSchoolById(id : any): Observable<any> {
    return this.http.delete<any>(`${this.url}/school/delete/${id}`);
  }

  public updateEducationById(id:any, data : any): Observable<any> {
    return this.http.post<any>(`${this.url}/school/update/${id}`, data);
  }  

  public getLanguajesAll(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/language/get-by-user?userId=${id}`);
  }

  public getLanguajeById(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/language/find/${id}`);
  }

  public addLanguage(data : any): Observable<any> {
    return this.http.post<any>(`${this.url}/language/create`, data);
  }

  public updateLanguaje(id: any, data : any): Observable<any> {
    return this.http.post<any>(`${this.url}/language/update/${id}`, data);
  }

  public deleteLanguaje(id: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/language/delete/${id}`);
  }

  public getCertificationsByUser(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/certification/get-by-user?userId=${id}`);
  }

  public getCertificationById(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/certification/find/${id}`);
  }

  public addCertification(data : any): Observable<any> {
    return this.http.post<any>(`${this.url}/certification/create`, data);
  }

  public updateCertification(id: any, data : any): Observable<any> {
    return this.http.post<any>(`${this.url}/certification/update/${id}`, data);
  }

  public deleteCertification(id: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/certification/delete/${id}`);
  }

  public getPostulationsByUser(pagination  : any): Observable<any> {

    const params = new HttpParams({
      fromObject: {
        pageNo: pagination.pageNo,
        pageSize: pagination.pageSize,
        userId: pagination.userId,
        keyword: pagination.keyword,
      }
    });


    return this.http.get<any>(`${this.url}/postulates/postulates-by-user-w`, {params: params});
  }


  public deletePostulationsByUser(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/postulates/delete/${id}`);
  }

  public getNotificationsByUser(pagination: any): Observable<any> {

    const params = new HttpParams({
      fromObject: {
        pageNo: pagination.pageNo,
        pageSize: pagination.pageSize,
        email: pagination.email,
        title: pagination.title
      }
    });

    return this.http.get<any>(`${this.url}/notification/view-by-user-web`,{params: params});
  }

  public getNotificationsById(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/notification/find/${id}`);
  }

  public deleteNotification(id: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/notification/delete/${id}`);
  }

  public changeStatusNotification(username: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/notification/change-status/${username}`);
  }

  public deleteAccount(userId: any): Observable<any> {
    return this.http.get<any>(`${this.url}/user/delete/${userId}`);
  }
  
  public changePassword(id: any, data : any): Observable<any> {
    return this.http.get<any>(`${this.url}/user/change-password/${id}`, data);
  }

  
  public getPreferencesRH(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/user/find-pre-rh/${id}`);
  }

  public updatePreferencesRH(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/user/update-pre-rh`, data);
  }


  
}
