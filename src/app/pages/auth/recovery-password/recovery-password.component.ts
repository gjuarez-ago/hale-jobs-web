import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs/internal/Subscription';
import { CustomHttpRespone } from 'src/app/models/CustomHttpResponse';
import { User } from 'src/app/models/core/user.model';

import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.css']
})
export class RecoveryPasswordComponent implements OnInit {
  
  
  public user!: User;
  public validateForm!: FormGroup;
  public subscriptions : Subscription[] = [];
  public isSpinning = false;

  
  constructor(
    private authenticationService : AuthService,
    private fb: FormBuilder, 
    private router: Router, 
    private message: NzMessageService,
    private ngxSpinner :  NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });

    if(this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl("/dashboard/my-statisticts");
    }
    
  }

  submitForm(): void {

    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    
    if(!this.validateForm.valid) {
      return ; 
    }

    this.isSpinning = true;
    let user = this.validateForm.value;
    this.subscriptions.push(
      this.authenticationService.recoveryPassword(user).subscribe(
        (response: CustomHttpRespone) => {   
          this.isSpinning = false;
          this.router.navigateByUrl('/auth/login');
          this.createMessage("success",  response.message);
        },
        (errorResponse: HttpErrorResponse) => {
          this.isSpinning = false;
          this.createMessage("error",  errorResponse.error.message);
        }
      )
    );

    if(!this.validateForm.valid) {
      this.createMessage("warning", "Es necesario llenar todos los campos!");
      return ; 
    }

  }


  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }


}
