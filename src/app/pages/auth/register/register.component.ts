import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationPlacement, NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public validateForm!: FormGroup;
  public subcriptions: Subscription[] = [];
  public sub: Subscription = new Subscription;
  public isSpinning = false;
  public isCompany = false;
  public siteKey : string = environment.siteKey;

  @ViewChild('f') myForm: NgForm | undefined
  
  constructor(
    private authenticationService : AuthService,
    private fb: FormBuilder,
    private router: Router,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private ngxSpinner :  NgxSpinnerService
    ) { }

  ngOnInit(): void {

    if(this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl("/dashboard/my-statisticts");
    }

    this.validateForm = this.fb.group({
      names: [null, [Validators.required]],
      fatherLastName: [null, [Validators.required]],
      motherLastName: [null, [Validators.required]],
      username: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      recaptcha: ['', Validators.required],
      acceptTerms: [null, [Validators.required]],
    });
  }

  changeRegistration(result : boolean): void {
    this.isCompany = result;
  }

  submitForm(): void {

    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }

    // if(!/^\d{10}$/.test(this.validateForm.value["phone"])) {
    //   this.createMessage("warning", "Número de contacto invalido");
      
    //   return;
    // }

    if (!this.validateForm.controls.acceptTerms.valid) {
      this.createMessage("info", "Es necesario aceptar los terminos y condiciones");
      return;
    }

    if (!this.validateForm.valid) {      
      this.createMessage("warning", "Campos pendientes");
      return;
    }

    this.isSpinning = true;
    let user = this.validateForm.value;
    this.ngxSpinner.show();

    this.subcriptions.push(
      this.authenticationService.register({...user, typeOfUser: this.isCompany ? 2 : 1}).subscribe(
        (response : any) => {
          this.createBasicNotification('topLeft');
          this.isSpinning = false;
          this.router.navigateByUrl("/auth/login");
          this.ngxSpinner.hide();

        },
        (errorResponse: HttpErrorResponse) => {
          this.isSpinning = false;
          this.ngxSpinner.hide();
          this.createMessage("error", errorResponse.error.message);
        }
      )
    );
  }

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  
  createBasicNotification(position: NzNotificationPlacement): void {
    this.notification.blank(
      'Registro exitoso 🙂',
      `Hemos enviado un email a la dirección ${this.myForm?.value["email"]} para que puedas verificar tu cuenta `,
      { nzPlacement: position, }
    );
  }

}
