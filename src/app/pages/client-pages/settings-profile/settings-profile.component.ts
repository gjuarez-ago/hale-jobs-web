import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/core/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-settings-profile',
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.css']
})
export class SettingsProfileComponent implements OnInit {

  confirmDeleteModal?: NzModalRef; // For testing by now

  public user: User| undefined;
  public userId !: number;
  public subscriptions: Subscription[] = [];
  public isLoadingGeneral = false;

  
  switchValue1 = false;
  switchValue2 = false;
  switchValue3 = false;

  validateForm!: FormGroup;

  

  constructor(
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private ngxSpinner: NgxSpinnerService,
    
  ) {
    this.validateForm = this.fb.group({
      currentPassword: [null, [Validators.required]],
      password: [null, [Validators.required]],
      newPassword: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {    
    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      this.userId = this.user.id;
    } else {
      this.router.navigateByUrl("/auth/login");
    }
  }

  showDeleteModal(): void {
    this.confirmDeleteModal = this.modal.confirm({
      nzTitle: '¿Seguro que deseas desactivar tu cuenta?',
      nzContent:
        'Si continúas con este proceso tu cuenta sera desactivada, se retirarán tus postulaciones, historial y notificaciones; en caso de querer volver a formar parte de la comunidad te solicitamos enviarnos un correo a help@hale-jobs.com.mx',
      nzOnOk: () => this.desactivateProfile(),
    });
  }
  
  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  public desactivateProfile() {
    this.authenticationService.desactivateProfile(this.user?.username).subscribe(
      (response: any) => {  
        this.onLogOut();
        this.createMessage("success", "Perfil desactivado correctamente 😀");
        this.isLoadingGeneral = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Problemas al desactivar el perfil');
        this.isLoadingGeneral = false;
      }
    )
  }

  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['auth/login']);
  }

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }
}