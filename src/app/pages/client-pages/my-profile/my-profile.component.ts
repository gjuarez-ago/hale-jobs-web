import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { CVUserService } from 'src/app/services/cv-user.service';
import { GenericService } from 'src/app/services/generic.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
 
  public user: any;
  public userId : any;
  public isLoadingGeneral = false;
  public subcriptions: Subscription[] = [];

  public visible = false;
  public switchValue = false;
  public userForm!: FormGroup;


  public listStates : any = [];
  public listCities : any = [];
  public listModwork : any = [];

  public userInformation : any;


  public previewVisible: boolean = false;
  public previewImage!: string | ArrayBuffer | null;
  public imgLoad!: File;
  userInformationOriginal: any;


  constructor(
    private cvService : CVUserService,
    private genericService : GenericService,
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private ngxSpinner: NgxSpinnerService 
  ) { 

    this.userForm = this.fb.group({
      city: [null, [Validators.required]],
      state: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.maxLength(50)]],
      gender: [null, [Validators.required]],
      modalidadTrabajo: [null, [Validators.required]],
      name: [null, [Validators.required,  Validators.maxLength(50)]],      
      numberPhone: [null, [Validators.required, Validators.minLength(10),Validators.maxLength(10)]],
      relocated: ['', [Validators.required]],
      apellidoPaterno: [null, [Validators.required, Validators.maxLength(50)]],
      apellidoMaterno: [null, [Validators.required, Validators.maxLength(50)]],
      dateOfBirth: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {

    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      this.userId = this.user.id;
      this.redirect(this.user);

      this.getCurrentUser();
      this.getStates();
      this.getModWorks();

    } else {
      this.router.navigateByUrl("/auth/login");
    }

  }

  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['auth/login']);
    this.createMessage("success", "Has cerrado sesión exitosamente 😀");
  }

  // Servicios API
  getCurrentUser() {
    this.isLoadingGeneral = true;
    this.authenticationService.getCurrentUser(this.user?.username).subscribe(
      (response: any) => {
       this.userInformation = response;
       this.previewImage = response.profileImageUrl == null ? 'https://thumbs.dreamstime.com/z/no-user-profile-picture-24185395.jpg' : response.profileImageUrl;
        
        this.isLoadingGeneral = false;       
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar los estados');
        this.isLoadingGeneral = false;
      }
    )
  }

  getUpdateUser() {
    this.isLoadingGeneral = true;
    this.authenticationService.getCurrentUser(this.user?.username).subscribe(
      (response: any) => {
       this.userInformationOriginal = response;    
       this.userInformationOriginal.city.id = response.city.id;
    
        this.isLoadingGeneral = false;       
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar los estados');
        this.isLoadingGeneral = false;
      }
    )
  }


  getStates() {
    this.isLoadingGeneral = true;
    this.genericService.getAllStates().subscribe(
      (response: any) => {
      
        this.listStates = response.map((prop: any, key: any) => {
          return {
            ...prop,
            key: key + 1,
          };
        }); 
        this.isLoadingGeneral = false;       
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar los estados');
        this.isLoadingGeneral = false;
      }
    )
  }

  getModWorks() {
    this.isLoadingGeneral = true;
    this.genericService.getAllTypeOfJobs().subscribe(
      (response: any) => {
      
        this.listModwork = response.map((prop: any, key: any) => {
          return {
            ...prop,
            key: key + 1,
          };
        }); 
        this.isLoadingGeneral = false;       
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar los estados');
        this.isLoadingGeneral = false;
      }
    )
  }


  getCities(p : any) {
    this.isLoadingGeneral = true;
    this.genericService.getAllCities(p).subscribe(
      (response: any) => {
        this.listCities = response.map((prop: any, key: any) => {
          return {
            ...prop,
            key: key + 1,
          };
        });        
        this.isLoadingGeneral = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar los estados');
        this.isLoadingGeneral = false;
      }
    )
  }


   // Lógica de negocio
   onSubmitForm() {

    for (const i in this.userForm.controls) {
      if (this.userForm.controls.hasOwnProperty(i)) {
        this.userForm.controls[i].markAsDirty();
        this.userForm.controls[i].updateValueAndValidity();
      }
    }

    if (!this.userForm.valid) {
      this.createMessage('warning', 'Es necesario llenar todos los campos!');
      return;
    }

    this.ngxSpinner.show();
    let data = this.userForm.value;

    this.isLoadingGeneral = true;
    this.cvService.updateCVPrincipal({...data, username: this.user?.username}).subscribe(
      (response: any) => {        
        this.getCurrentUser();
        this.message.create("success", 'Información actualizada correctamente!');
        this.isLoadingGeneral = false;
        this.close();
        this.ngxSpinner.hide();
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar los estados');
        this.ngxSpinner.hide();
        this.isLoadingGeneral = false;
      }
    )
   }


   getGender(value :any) {
    
    let arra = [
      { value: 'NE', id: 'S/C' },
      { value: 'Mujer', id: 'M' },
      { value: 'Hombre', id: 'H' },
    ];
    let index: any = arra.find((e: any) => e.id == value);
    return index.value;
   }

   
   
changePublicProfile(value : any) {

  this.isLoadingGeneral = true;
  this.ngxSpinner.show();

  this.cvService.changePublicProfile({value: value ,username: this.user?.username}).subscribe(
    (response: any) => {        
      this.isLoadingGeneral = false;
      this.close();
      this.ngxSpinner.hide();
    },
    (errorResponse: HttpErrorResponse) => {
      this.message.create("error", 'Ha ocurrido al cambiar la visibilidad de tu perfil');
      this.ngxSpinner.hide();
      this.isLoadingGeneral = false;
    }
  )

}


  public open(): void {
    this.visible = true;
    this.getUpdateUser();
  }

  public close(): void {
    this.visible = false;
  }

  private createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  
  //VALIDACIÓN DE INPUT DE TELEFONO PARA NO ACEPTAR LETRAS
  validateFormat(event:any) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
     if (!regex.test(key)) {
      event.returnValue = false;
       if (event.preventDefault) {
        event.preventDefault();
       }
     }
  }

  
  provinceChange(value:any): void {
    if(value) {
      this.getCities(value);
    }else {
      this.listCities = [];
      if(this.userInformation) {
        this.userInformation.city.id = undefined;
      }

    }
  }


  async handleChange(event:any){
    this.previewVisible = false;
    this.previewImage = "";

    const file:File = event.target.files[0];
    const isImg = file.type === 'image/png' || file.type === 'image/jpeg'

    if (!isImg) {
      this.message.error('Disculpa, Solo se aceptan Imagenes Jpg/png ');
      this.isLoadingGeneral = false;
      return;
    }

    this.imgLoad = event.target.files[0];
    const img = event.target.files[0];
    this.previewImage  = await getBase64(this.imgLoad);
    this.previewVisible = true;

    this.cvService.updateImage(this.imgLoad, this.user.username).subscribe(
      (response: any) => {        
        this.isLoadingGeneral = false;
        this.ngxSpinner.hide();
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido al cambiar la imagen de perfil');
        this.ngxSpinner.hide();
        this.isLoadingGeneral = false;
      }
    )
    




  }

  redirect(data: any) {
    if(data.profileCompleted) {
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


const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});