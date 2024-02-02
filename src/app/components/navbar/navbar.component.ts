import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { User } from 'src/app/models/core/user.model';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public user: User | undefined;
  public initials: string = "";

  constructor(private authenticationService: AuthService,    private modal: NzModalService,
    private router: Router, private message: NzMessageService) { }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      this.getInitials();
    }

    // else {
    //   this.router.navigateByUrl('/auth/login');
    // }
  }
  
  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['auth/login']);
    this.createMessage("success", "Has cerrado sesión exitosamente 😀");
  }

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  public getInitials() {
    let nameString =
      this.user?.names +
      ' ' +
      this.user?.motherLastName +
      ' ' +
      this.user?.fatherLastName;
    const fullName = nameString.split(' ');
    const initials = fullName.shift()!.charAt(0) + fullName.pop()!.charAt(0);


    this.initials = initials;
    
    return initials.toUpperCase();
  }

  info(): void {
    this.modal.warning({
      nzTitle: '¿Seguro que deseas cerrar sesión?',
      // nzContent: 'Bla bla ...',
      nzOkText: 'OK',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.onLogOut();
      },
    });
  }

  public toGoMyProfile() {
    if(this.user?.typeOfUser == 1) {
      this.router.navigateByUrl('profile/cv');
    }else {
      this.router.navigateByUrl('/dashboard/statisticts');
    }
  }



}
