import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { User } from 'src/app/models/core/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar-fixed',
  templateUrl: './navbar-fixed.component.html',
  styleUrls: ['./navbar-fixed.component.css']
})
export class NavbarFixedComponent implements OnInit {
  public user: User | undefined;


  constructor(private authenticationService: AuthService,
    private router: Router, private modal: NzModalService, private message: NzMessageService) { }

  ngOnInit(): void {
    
  }

  
  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['auth/login']);
    this.createMessage("success", "Has cerrado sesión exitosamente 😀");
  }

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

}
