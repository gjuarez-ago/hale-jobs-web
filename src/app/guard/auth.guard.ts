import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { NzNotificationPlacement, NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public placement = 'topRight';

  constructor(private authenticationService: AuthService, private router: Router,
    private notification: NzNotificationService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isUserLoggedIn();
  }

  private isUserLoggedIn(): boolean {

    if (this.authenticationService.isUserLoggedIn()) {
      return true;
    }

    this.router.navigate(['/auth/login']);
    this.createBasicNotification('topLeft');
    return false;
  }

  createBasicNotification(position: NzNotificationPlacement): void {
    this.notification.blank(
      'Acceso denegado 😕',
      'Debes iniciar sesión para acceder a esta página',
      { nzPlacement: position }
    );
  }



}