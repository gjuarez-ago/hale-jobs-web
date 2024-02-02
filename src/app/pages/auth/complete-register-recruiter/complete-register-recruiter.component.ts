import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/core/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { GenericService } from 'src/app/services/generic.service';

@Component({
  selector: 'app-complete-register-recruiter',
  templateUrl: './complete-register-recruiter.component.html',
  styleUrls: ['./complete-register-recruiter.component.css']
})
export class CompleteRegisterRecruiterComponent implements OnInit {

  public isLoadingGeneral = false;

  public current = 0;
  public currentStep = 0;


  public user: User | undefined;
  public idUser !: number;
  public subscriptions: Subscription[] = [];

  public isLoadingSupers = false;
  public isLoadingCategories = false;





  //VARIABLE DE LA SECCIÓN INFORMACIÓN PERSONAL
  public visibleCitys = false;
  public statesArray: any = []
 
  public stateSelection: any = {}

  public listStates : any = [];
  public listCities : any = [];
  public listSubcategories : any = [];
  public levelStudies : any = [];

  public citySelected : any;
  public stateSelected : any = null;

  index = 'First-content';

  //DECLARACIÓN DE FORMULARIOS REACTIVOS
  registerRecruiterForm = new FormGroup({
    state: new FormControl(null, Validators.required),
    city: new FormControl(null, Validators.required),
    gender: new FormControl(null, Validators.required),
    numberPhone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    dateOfBirth: new FormControl(null, Validators.required),
    jobTitle: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
  });

  registerRecruiterSection2Form = new FormGroup({
    areasSpecialidad: new FormControl(null, Validators.required),
    actitudesBlandas: new FormControl(null, Validators.required),
    actitudesTecnicas: new FormControl(null, Validators.required),
  });


  registerRecruiterSection3Form = new FormGroup({
    aboutMe: new FormControl(null, [Validators.required, Validators.minLength(50),Validators.maxLength(500)]),
  });
  initials: string = '';

  constructor(
    private message: NzMessageService,
    private router: Router,
    private authenticationService: AuthService,
    private genericService : GenericService,
    @Inject(LOCALE_ID) public locale: string,
    private modal: NzModalService,
  ) {}

  ngOnInit(): void {

    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      this.idUser = this.user.id;
      this.getStates();
      this.getLevelOfStudy();
      this.getSubcategories(); 
      this.getInitials(); 
    } else {
      this.router.navigateByUrl("/auth/login");
    }
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
    this.initials = initials.toUpperCase();
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

  
  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['auth/login']);
    this.createMessage('success', 'Has cerrado sesión exitosamente 😀');
  }

  public submitFormSection1() {
    if (this.registerRecruiterForm.valid) {
      this.changeContent();
      this.current += 1;
    } else {
      Object.values(this.registerRecruiterForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  
  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  public submitFormSection2() {
    if (this.registerRecruiterSection2Form.valid) {
      this.changeContent();
      this.current += 1;
    } else {
      Object.values(this.registerRecruiterSection2Form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  public submitFormSection3() {
    if (this.registerRecruiterSection3Form.valid) {
      this.registerRecruiterForm.get('dateOfBirth')?.setValue(formatDate(this.registerRecruiterForm.get('dateOfBirth')?.value, 'yyyy-dd-MM', this.locale ))

      const formData = {...this.registerRecruiterForm.value, ...this.registerRecruiterSection2Form.value, ...this.registerRecruiterSection3Form.value, username: this.user?.username}

      
      this.isLoadingGeneral = true;

      this.authenticationService.registerCompany(formData).subscribe(
        (response: any) => {
          this.message.create("success", 'Perfil actualizado correctamente!');
          this.user!.profileCompleted = true;
          this.authenticationService.addUserToLocalCache(this.user!);

          this.router.navigateByUrl("/dashboard/statisticts");
          this.isLoadingGeneral=false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.message.create("error", 'Ha ocurrido un error al guardar la información');
          this.isLoadingGeneral=false;
        }
      )
      
    
    } else {
      Object.values(this.registerRecruiterSection3Form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  provinceChange(value:any): void {
    if(value) {
      this.citySelected = undefined;
      this.getCities(value);
    }else {
      this.listCities = [];
      this.citySelected = undefined;
    }
  }



 

  pre(): void {
    this.current -= 1;

  }

  next(): void {
    this.changeContent();
    this.current += 1;
  }

  done(): void {
    this.router.navigate(['project/list']);
  }


  changeContent(): void {
    switch (this.current) {
      case 0: {
        break;
      }
      case 1: {
        break;
      }
      case 2: {
        break;
      }
      default: {
      }
    }
  }

  preStep(): void {
    this.currentStep -= 1;
    this.changeContent();
  }

  nextStep(): void {
    this.currentStep += 1;
    this.changeContent();
  }

  doneSteps(): void {
  }

  changeContentSteps(): void {
    switch (this.current) {
      case 0: {
        this.index = 'First-content';
        break;
      }
      case 1: {
        this.index = 'Second-content';
        break;
      }
      case 2: {
        this.index = 'third-content';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
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


    // Servicios externos:

    
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
          this.message.create("error", 'Ha ocurrido un error al recuperar los municipios');
          this.isLoadingGeneral = false;
        }
      )
    }

    getSubcategories() {
      this.isLoadingGeneral = true;
      this.genericService.getAllSubcategoriesByCategory().subscribe(
        (response: any) => {
          this.listSubcategories = response.map((prop: any, key: any) => {
            return {
              ...prop,
              key: key + 1,
            };
          }); 
          this.isLoadingGeneral = false;       
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingGeneral = false;
          this.message.create("error", 'Ha ocurrido un error al recuperar los municipios');
        }
      )
    }


    getLevelOfStudy() {
      this.isLoadingGeneral = true;
      this.genericService.getAllTypeOfLevelStudy().subscribe(
        (response: any) => {
         
          this.levelStudies = response.map((prop: any, key: any) => {
            return {
              ...prop,
              key: key + 1,
            };
          });        
          this.isLoadingGeneral=false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.message.create("error", 'Ha ocurrido un error al recuperar los municipios');
          this.isLoadingGeneral=false;
        }
      )
    }


  public attitudes: any = [
    {
      idAttitude: 1,
      attitudeName: 'Dominio de un idioma extranjero'
    },
    {
      idAttitude: 2,
      attitudeName: 'Un título o certificado'
    },
    {
      idAttitude: 3,
      attitudeName: 'Escritura formal'
    },
  ]

    public technicalAttitudes: any = [
      {
        id: 1,
        name: 'Manejo de hojas de cálculo'
      },
      {
        id: 2,
        name: 'Uso de programas de edición fotográfica'
      },
      {
        id: 3,
        name: 'Redacción de textos'
      },
      {
        id: 4,
        name: 'Java'
      },
      {
        id: 5,
        name: 'Programación orientada objetos'
      },
      {
        id: 6,
        name: 'C#'
      },
      {
        id: 7,
        name: 'C++'
      },
      {
        id: 8,
        name: 'AWS Services'
      },
      {
        id: 9,
        name: 'Azure Devops'
      },
      {
        id: 10,
        name: 'Google Cloud'
      },
      {
        id: 11,
        name: 'C'
      },
      {
        id: 12,
        name: 'Ruby and Rails'
      },
      {
        id: 13,
        name: 'Python'
      },
      {
        id: 14,
        name: '.Net Core'
      },
      {
        id: 15,
        name: 'Angular'
      },
      {
        id: 16,
        name: 'React.js'
      },
      {
        id: 17,
        name: 'Next.js'
      },
      {
        id: 18,
        name: 'MySQL'
      },
      {
        id: 19,
        name: 'SQL Server'
      },
      {
        id: 20,
        name: 'RxJS'
      },
      {
        id: 21,
        name: 'Linux'
      },
      {
        id: 23,
        name: 'PLSQL-Oracle'
      },
      {
        id: 24,
        name: 'SQLite'
      },
      {
        id: 25,
        name: 'Git'
      },
      {
        id: 26,
        name: 'Spring Boot'
      },
      {
        id: 27,
        name: 'Spring Framework'
      },
      {
        id: 28,
        name: 'Servicios Rest'
      },
      {
        id: 29,
        name: 'Microservicios'
      },
      {
        id: 30,
        name: 'Servicios SOAP'
      },
    ];








}
