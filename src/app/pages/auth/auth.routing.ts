import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecoveryPasswordComponent } from './recovery-password/recovery-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthComponent } from './container/auth.component';
import { CompleteRegisterUserComponent } from './complete-register-user/complete-register-user.component';
import { CompleteRegisterRecruiterComponent } from './complete-register-recruiter/complete-register-recruiter.component';

const routes: Routes = [
  {
    path: 'auth', component: AuthComponent, children: [
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
      { path: "recovery-password", component: RecoveryPasswordComponent },
      { path: "reset-password/:token/:email", component: ResetPasswordComponent },
    ]
  },
  { path: 'register/user', component: CompleteRegisterUserComponent },
  { path: 'register/recruiter', component: CompleteRegisterRecruiterComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
