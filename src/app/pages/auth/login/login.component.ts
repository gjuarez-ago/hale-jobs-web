import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { HeaderType } from 'src/app/enum/header-type.enum';
import { User } from 'src/app/models/core/user.model';

import { AuthService } from 'src/app/services/auth.service';
// import { HeaderType } from 'src/app/enum/header-type.enum';
// import {  UserLoggedIn } from 'src/app/models/User';
// import { AuthService } from 'src/app/services/auth.service';
// import { GetMessage } from 'src/app/utils/messages';
import { environment } from 'src/environments/environment';
// import { NzNotificationPlacement, NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public validateForm!: FormGroup;
  public subcriptions: Subscription[] = [];
  public siteKey = environment.siteKey;
  public isSpinning = false;
  public user: User | undefined;
  public role: string = '';

  constructor(
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private message: NzMessageService,
    private ngxSpinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      recaptcha: ['', Validators.required],
      remember: [true],
    });

    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      this.role = this.user!.role;
      this.redirect(this.role);
    }
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }

    if (!this.validateForm.valid) {
      this.createMessage('warning', 'Es necesario llenar todos los campos!');
      return;
    }

    this.ngxSpinner.show();
    this.isSpinning = true;
    let user = this.validateForm.value;

    this.subcriptions.push(
      this.authenticationService.login(user).subscribe(
        (response: any) => {
          const token = response.headers.get(HeaderType.JWT_TOKEN);
          this.authenticationService.saveToken(token!);
          this.authenticationService.addUserToLocalCache(response.body);
          this.isSpinning = false;
          // this.authenticationService.setUserActive(response.body);
          this.ngxSpinner.hide();
          this.redirect(response.body);
        },
        (errorResponse: HttpErrorResponse) => {
          this.ngxSpinner.hide();
          this.isSpinning = false;
          this.createMessage('error', errorResponse.error.message);
        }
      )
    );
  }

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  redirect(data: any) {
    if (data.profileCompleted) {
      switch (data.role) {
        case 'ROLE_USER':
          this.router.navigateByUrl('/profile/cv');
          break;
        case 'ROLE_HR':
          this.router.navigateByUrl('/dashboard/statisticts');
          break;
        case 'ROLE_ADMIN':
          this.router.navigateByUrl('/dashboard/statisticts');
          break;
        default:
          // alert("El usuario no tiene un rol en estos momentos")
          break;
      }
    } else {
      switch (data.role) {
        case 'ROLE_USER':
          this.router.navigateByUrl('/register/user');
          break;
        case 'ROLE_HR':
          this.router.navigateByUrl('/register/recruiter');
          break;
        case 'ROLE_ADMIN':
          this.router.navigateByUrl('/register/recruiter');
          break;
        default:
          // alert("El usuario no tiene un rol en estos momentos")
          break;
      }
    }
  }
}
