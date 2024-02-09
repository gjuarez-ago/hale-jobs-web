import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/core/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CVUserService } from 'src/app/services/cv-user.service';
import { GenericService } from 'src/app/services/generic.service';

@Component({
  selector: 'app-cv-profile',
  templateUrl: './cv-profile.component.html',
  styleUrls: ['./cv-profile.component.css'],
})
export class CvProfileComponent implements OnInit {
  todayDate: Date = new Date();

  public user: User | undefined;
  public userId: any;
  public isLoadingGeneral = false;
  public subcriptions: Subscription[] = [];

  //VARIABLES COMPARTIDAS

  public userInformationOriginal: any;
  public userInformation: any;
  public checkedWork: any = false;
  public checkedSchool: any = false;

  //VARIABLES DE INFORMACIÓN DE USUARIO ------------------------------------------

  public visibleInfoPersonal = false;
  public isLoadinginfoPersonal = false;

  public visibleAddExperience = false;
  public visibleEditExperience = false;

  public listStates: any = [];
  public listCities: any = [];
  public listSubcategories: any = [];
  public levelStudies: any = [];

  public listWorkExperiences: any = [];
  public loadingListWorkExperiences = false;

  public workExperienceEdit: any;
  public isLoadingWorkExperience: boolean = false;

  public listSkills: any = [];
  public listSkillsEdit: any = [];
  public isLoadingSkillsSave: boolean = false;
  public visibleAddSkills = false;

  public listSchools: any = [];
  public listCertifications: any = [];
  public certificationEdit: any;
  public schoolEdit: any;
  public isLoadingSchoolEdit = false;

  public listLanguajes: any = [];
  public languajeEdit: any;
  public isLoadingLanguaje = false;
  public visibleAddLanguaje = false;

  languajeForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    level: new FormControl(null, [Validators.required]),
  });

  userInfoPersonalForm = new FormGroup({
    jobTitle: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(50),
    ]),
    salary: new FormControl(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
    aboutMe: new FormControl(null, Validators.required),
  });

  //VARIABLES EXPERIENCIA USUARIO ------------------------------------------------------

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
    checked: new FormControl(null),
    description: new FormControl(null, [
      Validators.required,
      Validators.minLength(50),
    ]),
  });

  //VARIABLES HABILIDADES USUARIO ----------------------------------------------------------
  skillsForm = new FormGroup({
    skills: new FormControl([], Validators.required),
  });

  //VARIABLES EDUCACION DE USUARIO ----------------------------------------------------------
  public visibleAddEducation = false;
  public visibleEditEducation = false;

  educationUserForm = new FormGroup({
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

  //VARIABLES CERTIFICACIÓN DE USUARIO ----------------------------------------------------------
  public visibleAddCertificate = false;
  public visibleEditCertificate = false;
  public isLoadingCertificate = false;

  certificateUserForm = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(50),
    ]),
    url: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
  });
  public listRangeAmount: any = [];
  styleSheet: string = '';
  visibleEditLanguaje: boolean = false;

  constructor(
    private modalService: NzModalService,
    private cvService: CVUserService,
    private genericService: GenericService,
    private authenticationService: AuthService,
    private message: NzMessageService,
    private router: Router,
    private ngxSpinner: NgxSpinnerService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      this.userId = this.user.id;

      // this.getStates();
      this.getLevelOfStudy();
      this.getSubcategories();
      this.getWorkExperiencesByUser();
      this.getskillsByUser();
      this.getSchoolsByUser();
      this.getCertificationsByUser();
      this.getCurrentUser(this.user);
      this.getRangeAmount();
      this.getLanguajes();
    } else {
      this.router.navigateByUrl('/auth/login');
    }

    this.http
      .get('../../../assets/styles/print-pdf.css', { responseType: 'text' })
      .subscribe((styleSheet) => {
        this.styleSheet = styleSheet;
      });
  }

  // Servicios API
  getCurrentUser(user: any) {
    this.ngxSpinner.show();
    this.isLoadingGeneral = true;
    this.authenticationService.getCurrentUser(user.username).subscribe(
      (response: any) => {
        this.userInformationOriginal = response;

        this.isLoadingGeneral = false;
        this.ngxSpinner.hide();
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar los estados'
        );
        this.isLoadingGeneral = false;
        this.ngxSpinner.hide();
      }
    );
  }

  getUpdateUser() {
    this.ngxSpinner.show();
    this.isLoadingGeneral = true;
    this.authenticationService.getCurrentUser(this.user?.username).subscribe(
      (response: any) => {
        this.userInformation = response;
        this.isLoadingGeneral = false;
        this.ngxSpinner.hide();
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar los estados'
        );
        this.isLoadingGeneral = false;
        this.ngxSpinner.hide();
      }
    );
  }

  getWorkExperiencesByUser() {
    this.loadingListWorkExperiences = true;
    this.ngxSpinner.show();
    this.cvService.workExperiencesByUser(this.userId).subscribe(
      (response: any) => {
        this.listWorkExperiences = response;
        this.loadingListWorkExperiences = false;
        this.ngxSpinner.hide();
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar las experiencias de trabajo'
        );
        this.loadingListWorkExperiences = false;
        this.ngxSpinner.hide();
      }
    );
  }

  public getLanguajes() {
    this.isLoadingLanguaje = true;
    this.cvService.getLanguajesAll(this.userId).subscribe(
      (response: any) => {
        this.listLanguajes = response;
        this.isLoadingLanguaje = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar las experiencias de trabajo'
        );
        this.isLoadingLanguaje = false;
      }
    );
  }

  getWorkExperienceById(id: any) {
    this.isLoadingWorkExperience = true;
    this.cvService.workExperiencesById(id).subscribe(
      (response: any) => {
        if (response.worked) {
          response.ends = undefined;
        }

        this.workExperienceEdit = response;

        this.isLoadingWorkExperience = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar las experiencias de trabajo'
        );
        this.isLoadingWorkExperience = false;
      }
    );
  }

  public getRangeAmount() {
    this.isLoadingGeneral = true;
    this.subcriptions.push(
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

  getskillsByUser() {
    this.isLoadingGeneral = true;
    this.cvService.getSkillsByUser(this.userId).subscribe(
      (response: any) => {
        this.listSkills = [];
        this.listSkillsEdit = [];
        response.forEach((prop: any, key: any) => {
          this.listSkills.push(prop.value);
        });

        this.isLoadingGeneral = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar las skills'
        );
        this.isLoadingGeneral = false;
      }
    );
  }

  getSchoolsByUser() {
    this.isLoadingGeneral = true;
    this.cvService.getSchoolsByUser(this.userId).subscribe(
      (response: any) => {
        this.listSchools = response;
        this.isLoadingGeneral = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar las escuelas'
        );
        this.isLoadingGeneral = false;
      }
    );
  }

  getSchoolsById() {
    this.isLoadingGeneral = true;
    this.genericService.getAllStates().subscribe(
      (response: any) => {
        this.schoolEdit = response;
        this.isLoadingGeneral = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar las escuelas'
        );
        this.isLoadingGeneral = false;
      }
    );
  }

  getCertificationsByUser() {
    this.isLoadingGeneral = true;
    this.cvService.getCertificationsByUser(this.userId).subscribe(
      (response: any) => {
        this.listCertifications = response;
        this.isLoadingGeneral = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar las certificaciones'
        );
        this.isLoadingGeneral = false;
      }
    );
  }

  getCertificationById(id: any) {
    this.isLoadingGeneral = true;
    this.cvService.getCertificationById(id).subscribe(
      (response: any) => {
        this.certificationEdit = response;
        this.isLoadingGeneral = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar la certificación'
        );
        this.isLoadingGeneral = false;
      }
    );
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
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar los estados'
        );
        this.isLoadingGeneral = false;
      }
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

  // ------------------------------------------------- Lógica de negocio ------------------------------------------------

  //FUNCIONES DE INFORMACIÓN PERSONAL DE USUARIO --------------------------------------------------

  showModalInfoUser(): void {
    this.visibleInfoPersonal = true;
    this.getUpdateUser();
  }

  closeModalInfoUser() {
    this.visibleInfoPersonal = false;
  }

  closeModal(): void {
    //CERRAMOS MODAL
    this.visibleInfoPersonal = false;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.visibleInfoPersonal = false;
  }

  saveInfoUser(): void {
    if (!this.userInfoPersonalForm.valid) {
      Object.values(this.userInfoPersonalForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    let data = this.userInfoPersonalForm.value;
    this.ngxSpinner.show();

    this.cvService
      .updateCVBasic({ ...data, username: this.user?.username })
      .subscribe(
        (response: any) => {
          this.getCurrentUser(this.user);
          this.visibleInfoPersonal = false;
          this.isLoadingGeneral = false;
          this.ngxSpinner.hide();
        },
        (errorResponse: HttpErrorResponse) => {
          this.message.create(
            'error',
            'Ha ocurrido un error al actualizar la información'
          );
          this.isLoadingGeneral = false;
          this.ngxSpinner.hide();
        }
      );
  }

  //FUNCIONES DE EXPERIENCIA DE USUARIO -----------------------------------------------

  saveExperienceUser(): void {
    if (!this.registerRecruiterExperienceProfessionalForm.valid) {
      Object.values(
        this.registerRecruiterExperienceProfessionalForm.controls
      ).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

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
      userId: this.userId,
    };

    this.cvService.addWorkExperience(data).subscribe(
      (response: any) => {
        this.getWorkExperiencesByUser();
        this.isLoadingWorkExperience = false;
        this.visibleAddExperience = false;
        this.registerRecruiterExperienceProfessionalForm.reset();
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar las experiencias de trabajo'
        );
        this.isLoadingWorkExperience = false;
      }
    );
  }

  editExperienceUser(): void {
    if (!this.registerRecruiterExperienceProfessionalForm.valid) {
      Object.values(
        this.registerRecruiterExperienceProfessionalForm.controls
      ).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    let form = this.registerRecruiterExperienceProfessionalForm.value;

    let f1 = new Date(form.begins);
    let f2 = new Date(form.ends);

    if (f2 < f1 && !this.workExperienceEdit.worked) {
      this.message.create(
        'info',
        'La fecha de inicio no debe ser mayor a la de termino'
      );
      return;
    }

    if (
      (form.ends == null || form.ends == undefined) &&
      !this.workExperienceEdit.worked
    ) {
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
      userId: this.userId,
    };

    console.log(data);

    this.isLoadingWorkExperience = true;

    this.cvService
      .updateExperienceByUser(this.workExperienceEdit.id, data)
      .subscribe(
        (response: any) => {
          this.getWorkExperiencesByUser();
          this.isLoadingWorkExperience = false;
          this.visibleEditExperience = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.message.create(
            'error',
            'Ha ocurrido un error al recuperar las experiencias de trabajo'
          );
          this.isLoadingWorkExperience = false;
        }
      );

    // this.experiencesWorkUser[this.idExperienceProfessional] = this.registerRecruiterExperienceProfessionalForm.value;
    // this.visibleAddExperiences = false;
    // this.registerRecruiterExperienceProfessionalForm.reset()
  }

  showModalEditExp(element: any): void {
    this.getWorkExperienceById(element.id);
    this.visibleEditExperience = true;
  }

  closeModalEditExp() {
    this.visibleEditExperience = false;
  }

  showModalAddExp() {
    this.workExperienceEdit = undefined;
    this.registerRecruiterExperienceProfessionalForm.reset();
    this.visibleAddExperience = true;
  }

  closeModalAddExp() {
    this.visibleAddExperience = false;
  }

  deleteExperienceUser(): void {
    this.modalService.confirm({
      nzTitle: `Eliminar experiencia "${this.workExperienceEdit.job}"`,
      nzContent:
        '¿Seguro que deseas eliminar la siguiente experiencia de trabajo?',
      nzOkText: 'Eliminar',
      nzCancelText: 'Cerrar',
      nzOnOk: () => {
        this.isLoadingWorkExperience = true;

        this.cvService
          .deleteExperiencesById(this.workExperienceEdit.id)
          .subscribe(
            (response: any) => {
              this.getWorkExperiencesByUser();
              this.isLoadingWorkExperience = false;
              this.visibleEditExperience = false;
            },
            (errorResponse: HttpErrorResponse) => {
              this.message.create(
                'error',
                'Ha ocurrido un error al recuperar las experiencias de trabajo'
              );
              this.isLoadingWorkExperience = false;
            }
          );
      },
    });
  }

  //FUNCIONES DE HABILIDADES USUARIO -------------------------------------------------------
  showModalSkills(): void {
    this.getSkillsByUserEdit();
  }

  closeModalSkills() {
    this.visibleAddSkills = false;
  }

  saveSkillsUser(): void {
    if (!this.skillsForm.valid) {
      this.visibleAddSkills = false;
      Object.values(this.skillsForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    let form = this.skillsForm.value;
    this.isLoadingSkillsSave = true;
    this.ngxSpinner.show();

    console.log(form);

    this.cvService
      .addSkills({ userId: this.userId, skills: form.skills })
      .subscribe(
        (response: any) => {
          this.getskillsByUser();
          this.isLoadingSkillsSave = false;
          this.visibleAddSkills = false;
          this.ngxSpinner.hide();
        },
        (errorResponse: HttpErrorResponse) => {
          this.message.create(
            'error',
            'Ha ocurrido un error al recuperar las experiencias de trabajo'
          );
          this.isLoadingSkillsSave = false;
          this.ngxSpinner.hide();
        }
      );
  }

  getSkillsByUserEdit() {
    this.isLoadingGeneral = true;
    this.cvService.getSkillsByUser(this.userId).subscribe(
      (response: any) => {
        this.listSkillsEdit = [];
        response.forEach((prop: any, key: any) => {
          this.listSkillsEdit.push(prop.value);
        });
        this.isLoadingGeneral = false;
        this.visibleAddSkills = true;

        console.log(this.listSkillsEdit);
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar las skills'
        );
        this.isLoadingGeneral = false;
      }
    );
  }

  //FUNCIONES DE EDUCACION USUARIO -------------------------------------------------------

  showModalEducation(e: any, type: any): void {
    if (type == 'ADD') {
      this.visibleAddEducation = true;
    } else {
      this.getEducationById(e.id);
      this.visibleEditEducation = true;
    }
  }

  closeModalEducation(type: any): void {
    this.schoolEdit = undefined;

    if (type == 'ADD') {
      this.visibleAddEducation = false;
    } else {
      this.visibleEditEducation = false;
    }
  }

  deleteEducationUser(): void {
    this.ngxSpinner.show();
    this.cvService.deleteSchoolById(this.schoolEdit.id).subscribe(
      (response: any) => {
        this.getSchoolsByUser();
        this.ngxSpinner.hide();
        this.visibleEditEducation = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar las experiencias de trabajo'
        );
        this.ngxSpinner.hide();
      }
    );
  }

  saveEducationUser(): void {
    if (!this.educationUserForm.valid) {
      Object.values(this.educationUserForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    let form = this.educationUserForm.value;

    let f1 = new Date(form.begins);
    let f2 = new Date(form.ends);

    if (f2 < f1 && !this.checkedSchool) {
      this.message.create(
        'info',
        'La fecha de inicio no debe ser mayor a la de termino'
      );
      return;
    }

    if ((form.ends == null || form.ends == undefined) && !this.checkedSchool) {
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
      ends: this.checkedSchool ? 'NA' : form.ends,
      worked: this.checkedSchool ? true : false,
      userId: this.userId,
    };

    this.isLoadingSchoolEdit = true;

    this.cvService.addSchoolExperience(data).subscribe(
      (response: any) => {
        this.getSchoolsByUser();
        this.isLoadingSchoolEdit = false;
        this.visibleAddEducation = false;
        this.educationUserForm.reset();
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar las experiencias de trabajo'
        );
        this.isLoadingSchoolEdit = false;
      }
    );
  }

  public downLoadCV() {}

  editEducationUser(): void {
    if (!this.educationUserForm.valid) {
      Object.values(this.educationUserForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }

    let form = this.educationUserForm.value;

    let f1 = new Date(form.begins);
    let f2 = new Date(form.ends);

    if (f2 < f1 && !this.schoolEdit.worked) {
      this.message.create(
        'info',
        'La fecha de inicio no debe ser mayor a la de termino'
      );
      return;
    }

    if (
      (form.ends == null || form.ends == undefined) &&
      !this.schoolEdit.worked
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
      ends: this.schoolEdit.worked ? 'NA' : form.ends,
      worked: this.schoolEdit.worked ? true : false,
      userId: this.userId,
    };

    this.isLoadingSchoolEdit = true;

    this.cvService.updateEducationById(this.schoolEdit.id, data).subscribe(
      (response: any) => {
        this.getSchoolsByUser();
        this.isLoadingSchoolEdit = false;
        this.visibleEditEducation = false;
        this.educationUserForm.reset();
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar las experiencias de trabajo'
        );
        this.isLoadingSchoolEdit = false;
      }
    );
  }

  public getEducationById(id: any) {
    this.isLoadingSchoolEdit = true;
    this.cvService.getSchoolsById(id).subscribe(
      (response: any) => {
        this.schoolEdit = response;

        if (response.worked) {
          response.ends = undefined;
        }
        this.isLoadingSchoolEdit = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar las experiencias de trabajo'
        );
        this.isLoadingSchoolEdit = false;
      }
    );
  }

  //FUNCIONES DE CERTIFICADOS USUARIO -------------------------------------------------------

  showModalCertificate(e: any, type: any): void {
    if (type == 'ADD') {
      this.visibleAddCertificate = true;
    } else {
      this.visibleEditCertificate = true;
      this.getCertificationById(e.id);
    }
  }

  closeModalCertificate(type: any) {
    if (type == 'ADD') {
      this.visibleAddCertificate = false;
    } else {
      this.visibleEditCertificate = false;
    }
  }

  // Modal Languaje
  showModalLanguaje(e: any, type: any): void {
    if (type == 'ADD') {
      this.visibleAddLanguaje = true;
    } else {
      this.visibleEditLanguaje = true;
      this.getLanguajeById(e.id);
    }
  }

  closeModalLanguaje(type: any) {
    if (type == 'ADD') {
      this.visibleAddLanguaje = false;
    } else {
      this.languajeEdit = undefined;
      this.visibleEditLanguaje = false;
    }
  }

  public getLanguajeById(id: any) {
    this.isLoadingGeneral = true;
    this.cvService.getLanguajeById(id).subscribe(
      (response: any) => {
        this.languajeEdit = response;
        this.isLoadingLanguaje = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar el lenguaje'
        );
        this.isLoadingLanguaje = false;
      }
    );
  }

  public saveLanguaje() {
    if (!this.languajeForm.valid) {
      Object.values(this.languajeForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    let form = this.languajeForm.value;

    let data = {
      level: form.level,
      name: form.name,
      userId: this.userId,
    };

    this.isLoadingLanguaje = true;
    this.ngxSpinner.show();

    this.cvService.addLanguage(data).subscribe(
      (response: any) => {
        this.getLanguajes();
        this.isLoadingLanguaje = false;
        this.visibleAddLanguaje = false;
        this.languajeForm.reset();
        this.ngxSpinner.hide();
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al guardar el idioma'
        );
        this.isLoadingLanguaje = false;
      }
    );
  }

  public editLanguaje() {
    if (!this.languajeForm.valid) {
      Object.values(this.languajeForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    let data = this.languajeForm.value;
    this.ngxSpinner.show();

    this.cvService.updateLanguaje(this.languajeEdit.id, data).subscribe(
      (response: any) => {
        this.getLanguajes();
        this.isLoadingLanguaje = false;
        this.visibleEditLanguaje = false;
        this.languajeForm.reset();
        this.ngxSpinner.hide();
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al editar la sección de idiomas'
        );
        this.isLoadingLanguaje = false;
      }
    );
  }

  deleteCertificateUser(): void {
    this.modalService.confirm({
      nzTitle: `Eliminar experiencia "${this.certificationEdit.job}"`,
      nzContent:
        '¿Seguro que deseas eliminar la siguiente experiencia de trabajo?',
      nzOkText: 'Eliminar',
      nzCancelText: 'Cerrar',
      nzOnOk: () => {
        this.isLoadingWorkExperience = true;

        this.cvService.deleteCertification(this.certificationEdit.id).subscribe(
          (response: any) => {
            this.getCertificationsByUser();
            this.isLoadingWorkExperience = false;
            this.visibleEditExperience = false;
          },
          (errorResponse: HttpErrorResponse) => {
            this.message.create(
              'error',
              'Ha ocurrido un error al recuperar las experiencias de trabajo'
            );
            this.isLoadingWorkExperience = false;
          }
        );
      },
    });
  }

  saveCertificateUser(): void {
    if (!this.certificateUserForm.valid) {
      Object.values(this.certificateUserForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    let form = this.certificateUserForm.value;

    let data = {
      description: form.description,
      name: form.name,
      url: form.url,
      userId: this.userId,
    };

    this.isLoadingCertificate = true;

    this.cvService.addCertification(data).subscribe(
      (response: any) => {
        this.getCertificationsByUser();
        this.isLoadingCertificate = false;
        this.visibleAddCertificate = false;
        this.certificateUserForm.reset();
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create(
          'error',
          'Ha ocurrido un error al recuperar las experiencias de trabajo'
        );
        this.isLoadingCertificate = false;
      }
    );
  }

  editCertificateUser(): void {
    if (!this.certificateUserForm.valid) {
      Object.values(this.certificateUserForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    let form = this.certificateUserForm.value;

    let data = {
      description: form.description,
      name: form.name,
      url: form.url,
      userId: this.userId,
    };

    this.isLoadingCertificate = true;

    this.cvService
      .updateCertification(this.certificationEdit.id, data)
      .subscribe(
        (response: any) => {
          this.getCertificationsByUser();
          this.isLoadingCertificate = false;
          this.visibleEditCertificate = false;
          this.certificateUserForm.reset();
        },
        (errorResponse: HttpErrorResponse) => {
          this.message.create(
            'error',
            'Ha ocurrido un error al recuperar las experiencias de trabajo'
          );
          this.isLoadingCertificate = false;
        }
      );
  }

  //VALIDACIÓN DE INPUT PARA NO ACEPTAR LETRAS
  public validateFormat(event: any) {
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

  public technicalAttitudes: any = [
    {
      id: 1,
      value: 'Manejo de hojas de cálculo',
    },
    {
      id: 2,
      value: 'Uso de programas de edición fotográfica',
    },
    {
      id: 3,
      value: 'Redacción de textos',
    },
    {
      id: 4,
      value: 'Java',
    },
    {
      id: 5,
      value: 'Programación orientada objetos',
    },
    {
      id: 6,
      value: 'C#',
    },
    {
      id: 7,
      value: 'C++',
    },
    {
      id: 8,
      value: 'AWS Services',
    },
    {
      id: 9,
      value: 'Azure Devops',
    },
    {
      id: 10,
      value: 'Google Cloud',
    },
    {
      id: 11,
      value: 'C',
    },
    {
      id: 12,
      value: 'Ruby and Rails',
    },
    {
      id: 13,
      value: 'Python',
    },
    {
      id: 14,
      value: '.Net Core',
    },
    {
      id: 15,
      value: 'Angular',
    },
    {
      id: 16,
      value: 'React.js',
    },
    {
      id: 17,
      value: 'Next.js',
    },
    {
      id: 18,
      value: 'MySQL',
    },
    {
      id: 19,
      value: 'SQL Server',
    },
    {
      id: 20,
      value: 'RxJS',
    },
    {
      id: 21,
      value: 'Linux',
    },
    {
      id: 23,
      value: 'PLSQL-Oracle',
    },
    {
      id: 24,
      value: 'SQLite',
    },
    {
      id: 25,
      value: 'Git',
    },
    {
      id: 26,
      value: 'Spring Boot',
    },
    {
      id: 27,
      value: 'Spring Framework',
    },
    {
      id: 28,
      value: 'Servicios Rest',
    },
    {
      id: 29,
      value: 'Microservicios',
    },
    {
      id: 30,
      value: 'Servicios SOAP',
    },
  ];

  public languajesSelect = [
    {
      name: 'Español',
      key: 'ES',
    },
    {
      name: 'Inglés',
      key: 'EN',
    },
    {
      name: 'Chino Mandarín',
      key: 'CH',
    },
    {
      name: 'Hindi',
      key: 'HI',
    },
    {
      name: 'Arabe',
      key: 'ARA',
    },
    {
      name: 'Bengalí',
      key: 'BENG',
    },
    {
      name: 'Francés',
      key: 'FR',
    },
    {
      name: 'Ruso',
      key: 'URS',
    },
    {
      name: 'Portugués',
      key: 'PORT',
    },
    {
      name: 'Urdu',
      key: 'URDU',
    },
    {
      name: 'Italiano',
      key: 'ITAL',
    },
  ];

  public levels = [
    {
      name: 'Básico',
      key: 'AB',
    },
    {
      name: 'Intermedio',
      key: 'MED',
    },
    {
      name: 'Avanzado',
      key: 'AV',
    },
  ];

  public printPDF() {
    const printArea: HTMLElement | null = document.getElementById('pdf-2');
    // node?.appendChild(printArea!);

    const printWindow = window.open('', 'PRINT-PDF')!;
    // printWindow.document.write(`<html lang="en"><head></head><body></body>${printArea?.innerHTML}</html>`);
    printWindow.document.write(
      `<html lang="en"><head><style> ${this.styleSheet} </style> </head><body></body>${printArea?.innerHTML}</html>`
    );
    printWindow.document.close();
    // printWindow.focus();
    printWindow.document.title = this.userInformationOriginal.username;
    printWindow.print();
  }

  public disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.todayDate) > 0;
}
