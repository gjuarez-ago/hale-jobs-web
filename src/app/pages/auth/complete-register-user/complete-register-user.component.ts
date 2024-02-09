import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/core/user.model';

import { AuthService } from 'src/app/services/auth.service';
import { GenericService } from 'src/app/services/generic.service';

import { minimumAgeValidator } from 'src/app/utils/custom-form-validators';

@Component({
  selector: 'app-complete-register-user',
  templateUrl: './complete-register-user.component.html',
  styleUrls: ['./complete-register-user.component.css'],
})
export class CompleteRegisterUserComponent implements OnInit {
  public isLoadingGeneral = false;
  public current = 0;

  public user: User | undefined;
  public idUser!: number;
  public subscriptions: Subscription[] = [];

  public isLoadingSupers = false;
  public isLoadingCategories = false;

  public currentStep = 0;

  public visibleAddCertificate = false;
  public visibleAddExperiences = false;
  public visibleAlert = false;
  public visibleAlertProfessional = false;
  public visibleAlertCV = false;
  public verificateFormsSteps: boolean = true;
  public certificatesUser: any = [];
  public experiencesWorkUser: any = [];
  public listStates: any = [];
  public listCities: any = [];
  public listSubcategories: any = [];
  public levelStudies: any = [];
  public listTypeOfJobs: any = [];
  public listModwork: any = [];

  public checkedSchool = false;
  public checkedWork = false;
  public citySelected: any;
  public stateSelected: any;

  index = 'First-content';

  todayDate: Date = new Date();

  //DECLARACIÓN DE FORMULARIOS REACTIVOS
  registerRecruiterForm = new FormGroup({
    state: new FormControl(null, Validators.required),
    city: new FormControl(null, Validators.required),
    gender: new FormControl(null, Validators.required),
    numberPhone: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    dateOfBirth: new FormControl(null, [
      Validators.required,
      minimumAgeValidator(18),
    ]),
  });

  registerRecruiterSection2Form = new FormGroup({
    findJobs: new FormControl(null, Validators.required),
    findJob: new FormControl(null, Validators.required),
    learnSkills: new FormControl(null, Validators.required),
  });

  registerRecruiterCVSection1Form = new FormGroup({
    jobTitle: new FormControl(null, [Validators.required]),
    salary: new FormControl(null, Validators.required),
    modalidadTrabajo: new FormControl(null, Validators.required),
    relocated: new FormControl(null, Validators.required),
    skills: new FormControl(null, Validators.required),
  });

  registerRecruiterCVSection2Form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
    ]),
    type: new FormControl(null, [Validators.required]),
    schoolName: new FormControl(null, [
      Validators.required,
      Validators.minLength(5),
    ]),
    begins: new FormControl(null, [Validators.required]),
    ends: new FormControl(null),
    checked: new FormControl(false),
  });

  registerRecruiterCVSection3Form = new FormGroup({
    aboutMe: new FormControl(null, [
      Validators.required,
      Validators.minLength(50),
    ]),
  });

  registerRecruiterExperienceProfessionalForm = new FormGroup({
    job: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(50),
    ]),
    company: new FormControl(null, Validators.required),
    skills: new FormControl(null, Validators.required),
    begins: new FormControl(null, Validators.required),
    ends: new FormControl(null),
    checked: new FormControl(false),
    description: new FormControl(null, [
      Validators.required,
      Validators.minLength(50),
    ]),
  });

  public listRangeAmount: any = [];
  initials: string = '';

  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private message: NzMessageService,
    private genericService: GenericService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      this.idUser = this.user.id;
      this.getStates();
      this.getLevelOfStudy();
      this.getSubcategories();
      this.getModWorks();
      this.getRangeAmount();
      this.getInitials();
    } else {
      this.router.navigateByUrl('/auth/login');
    }
  }

  public deleteCardCertificate(index: any) {
    this.certificatesUser.splice(index, 1);
  }

  public deleteCardExperience(index: any) {
    this.experiencesWorkUser.splice(index, 1);
  }

  public submitFormSection1() {
    if (this.registerRecruiterForm.valid) {
      this.changeContent();
      this.current += 1;
    } else {
      Object.values(this.registerRecruiterForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  public submitFormSection2() {
    if (this.registerRecruiterSection2Form.valid) {
      this.changeContent();
      this.current += 1;
    } else {
      Object.values(this.registerRecruiterSection2Form.controls).forEach(
        (control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        }
      );
    }
  }

  provinceChange(value: any): void {
    if (value) {
      this.citySelected = undefined;
      this.getCities(value);
    } else {
      this.listCities = [];
      this.citySelected = undefined;
    }
    // this.registerRecruiterForm.get('idCity')?.reset()
  }

  getDatesCitys = (citys: any) =>
    citys.idState == this.registerRecruiterForm.get('idState')?.value;

  pre(): void {
    this.current -= 1;
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

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  verificationForms(): void {
    if (this.registerRecruiterCVSection3Form.valid) {
      this.changeContent();
      this.current += 1;
      this.visibleAlert = false;
    } else {
      this.visibleAlert = true;
      Object.values(this.registerRecruiterCVSection3Form.controls).forEach(
        (control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        }
      );
    }
  }

  next(): void {
    this.changeContent();
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
    if (this.registerRecruiterCVSection1Form.valid) {
      this.currentStep += 1;
      this.changeContent();
    } else {
      Object.values(this.registerRecruiterCVSection1Form.controls).forEach(
        (control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        }
      );
    }
  }

  nextStep2(): void {
    if (this.certificatesUser.length > 0) {
      this.currentStep += 1;
      this.changeContent();
      this.visibleAlertCV = false;
    } else {
      this.visibleAlertCV = true;
    }
  }

  doneSteps(): void {
    console.log('done');
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

  showModal(): void {
    this.visibleAddCertificate = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.visibleAddCertificate = false;
  }

  closeModal(): void {
    this.visibleAddCertificate = false;
    this.visibleAddExperiences = false;
  }

  saveCertificate(): void {
    if (this.registerRecruiterCVSection2Form.valid) {
      let form = this.registerRecruiterCVSection2Form.value;

      let f1 = new Date(form.begins);
      let f2 = new Date(form.ends);

      if (f2 < f1 && !this.checkedSchool) {
        this.message.create(
          'info',
          'La fecha de inicio no debe ser mayor a la de termino'
        );
        return;
      }

      if (
        (form.ends == null || form.ends == undefined) &&
        !this.checkedSchool
      ) {
        this.message.create(
          'warning',
          'Es necesario agregar la fecha de termino'
        );
        return;
      }

      let data = {
        name: form.name,
        type: form.type,
        schoolName: form.schoolName,
        begins: form.begins,
        ends: form.checked ? 'NA' : form.ends,
        worked: form.checked ? true : false,
      };

      this.certificatesUser.push(data);
      this.visibleAddCertificate = false;
      this.registerRecruiterCVSection2Form.reset();
      this.checkedSchool = false;
    } else {
      Object.values(this.registerRecruiterCVSection2Form.controls).forEach(
        (control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        }
      );

      return;
    }
  }

  saveExperienceUser(): void {
    if (this.registerRecruiterExperienceProfessionalForm.valid) {
      let form = this.registerRecruiterExperienceProfessionalForm.value;

      let f1 = new Date(form.begins);
      let f2 = new Date(form.ends);

      if (f2 < f1 && !this.checkedWork) {
        this.message.create(
          'info',
          'La fecha de inicio no debe ser mayor a la de termino'
        );
        return;
      }

      if ((form.ends == null || form.ends == undefined) && !this.checkedWork) {
        this.message.create('info', 'Es necesario agregar la fecha de termino');
        return;
      }

      let data = {
        job: form.job,
        company: form.company,
        skills: form.skills,
        begins: form.begins,
        ends: form.checked ? 'NA' : form.ends,
        worked: form.checked ? true : false,
        description: form.description,
      };

      this.experiencesWorkUser.push(data);
      this.visibleAddExperiences = false;
      this.registerRecruiterExperienceProfessionalForm.reset();
      this.checkedWork = false;
    } else {
      Object.values(
        this.registerRecruiterExperienceProfessionalForm.controls
      ).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  saveFormsData(): void {
    if (this.experiencesWorkUser.length > 0) {
      const formsData = {
        ...this.registerRecruiterForm.value,
        ...this.registerRecruiterSection2Form.value,
        ...this.registerRecruiterCVSection1Form.value,
        ...this.registerRecruiterCVSection3Form.value,
        schools: this.certificatesUser,
        experiences: this.experiencesWorkUser,
        username: this.user?.username,
      };

      // console.log(this.registerRecruiterForm.value);
      // console.log(this.registerRecruiterSection2Form.value);
      // console.log(this.registerRecruiterCVSection1Form.value);
      // console.log(this.registerRecruiterCVSection3Form.value);
      // console.log(this.certificatesUser);
      // console.log(this.experiencesWorkUser);

      console.log(formsData);

      this.isLoadingGeneral = true;

      this.authenticationService.registerUser(formsData).subscribe(
        (response: any) => {
          this.message.create('success', 'Perfil actualizado correctamente!');
          this.user!.profileCompleted = true;
          this.authenticationService.addUserToLocalCache(this.user!);

          this.router.navigateByUrl('/profile/cv');
          this.isLoadingGeneral = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.message.create(
            'error',
            'Ha ocurrido un error al guardar la información'
          );
          this.isLoadingGeneral = false;
        }
      );
    } else {
      this.visibleAlertProfessional = true;
    }
  }

  showModalExp(): void {
    this.visibleAddExperiences = true;
  }

  closeModalExp(): void {
    console.log('Button ok clicked!');
    this.visibleAddExperiences = false;
  }

  //VALIDACIÓN DE INPUT DE TELEFONO PARA NO ACEPTAR LETRAS
  validateFormat(event: any) {
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

  // Services API

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
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar los estados'
        );
        this.isLoadingGeneral = false;
      }
    );
  }

  public getRangeAmount() {
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.genericService.getAllRangeAmount().subscribe(
        (response: any) => {
          this.listRangeAmount = response;
          this.isLoadingGeneral = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingGeneral = false;
          this.message.create('error', errorResponse.error.message);
        }
      )
    );
  }

  getCities(p: any) {
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
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar los municipios'
        );
        this.isLoadingGeneral = false;
      }
    );
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
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar los municipios'
        );
      }
    );
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
        this.isLoadingGeneral = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar los municipios'
        );
        this.isLoadingGeneral = false;
      }
    );
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
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar los estados'
        );
        this.isLoadingGeneral = false;
      }
    );
  }

  public technicalAttitudes: any = [
    {
      id: 1,
      name: 'Manejo de hojas de cálculo',
    },
    {
      id: 2,
      name: 'Uso de programas de edición fotográfica',
    },
    {
      id: 3,
      name: 'Redacción de textos',
    },
    {
      id: 4,
      name: 'Java',
    },
    {
      id: 5,
      name: 'Programación orientada objetos',
    },
    {
      id: 6,
      name: 'C#',
    },
    {
      id: 7,
      name: 'C++',
    },
    {
      id: 8,
      name: 'AWS Services',
    },
    {
      id: 9,
      name: 'Azure Devops',
    },
    {
      id: 10,
      name: 'Google Cloud',
    },
    {
      id: 11,
      name: 'C',
    },
    {
      id: 12,
      name: 'Ruby and Rails',
    },
    {
      id: 13,
      name: 'Python',
    },
    {
      id: 14,
      name: '.Net Core',
    },
    {
      id: 15,
      name: 'Angular',
    },
    {
      id: 16,
      name: 'React.js',
    },
    {
      id: 17,
      name: 'Next.js',
    },
    {
      id: 18,
      name: 'MySQL',
    },
    {
      id: 19,
      name: 'SQL Server',
    },
    {
      id: 20,
      name: 'RxJS',
    },
    {
      id: 21,
      name: 'Linux',
    },
    {
      id: 23,
      name: 'PLSQL-Oracle',
    },
    {
      id: 24,
      name: 'SQLite',
    },
    {
      id: 25,
      name: 'Git',
    },
    {
      id: 26,
      name: 'Spring Boot',
    },
    {
      id: 27,
      name: 'Spring Framework',
    },
    {
      id: 28,
      name: 'Servicios Rest',
    },
    {
      id: 29,
      name: 'Microservicios',
    },
    {
      id: 30,
      name: 'Servicios SOAP',
    },
  ];

  public disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.todayDate) > 0;
}
