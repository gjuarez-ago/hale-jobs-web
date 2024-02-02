import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { RecoveryPasswordComponent } from './recovery-password/recovery-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZoroModulesComponents } from 'src/app/modules/ngzoro-modules-component';
import { NgxModulesComponents } from 'src/app/modules/ngx-modules-component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './container/auth.component';
import { CompleteRegisterUserComponent } from './complete-register-user/complete-register-user.component';
import { CompleteRegisterRecruiterComponent } from './complete-register-recruiter/complete-register-recruiter.component';

const authComponents: any = [
  AuthComponent,
  LoginComponent,
  RecoveryPasswordComponent,
  ResetPasswordComponent,
  RegisterComponent,
  CompleteRegisterUserComponent,
  CompleteRegisterRecruiterComponent
]

@NgModule({
  declarations: [
    authComponents,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZoroModulesComponents,
    NgxModulesComponents,
    RouterModule
  ],
  exports: [
    authComponents,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZoroModulesComponents,
    NgxModulesComponents,
  ]
})
export class AuthModule { }
