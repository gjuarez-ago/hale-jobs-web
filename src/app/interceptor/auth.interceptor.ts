import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService : AuthService) {}

  intercept(httpRequest: HttpRequest<unknown>, HttpHandler: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // * Estas no requieren authorización
    if(httpRequest.url.includes(`${this.authenticationService.host}/user/login`)){
      return HttpHandler.handle(httpRequest); 
    }

    if(httpRequest.url.includes(`${this.authenticationService.host}/user/reset-password`)){
      return HttpHandler.handle(httpRequest); 
    }

    if(httpRequest.url.includes(`${this.authenticationService.host}/user/recovery-password`)){
      return HttpHandler.handle(httpRequest); 
    }

    this.authenticationService.loadToken();
    const token = this.authenticationService.getToken();
    
    // *Con esto establecemos que las demas peticiones se realizan con el token en su header
    const request = httpRequest.clone({ setHeaders: { Authorization: `Bearer ${token}` }});
    return HttpHandler.handle(request); 
  }

}