import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/core/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CVUserService } from 'src/app/services/cv-user.service';
import { GenericService } from 'src/app/services/generic.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  public user: User| undefined;
  public userId : any;
  public username : any;
  public isLoadingGeneral = false;
  public subcriptions: Subscription[] = [];
  
  public previewImage : any = [];
  public userInformation : any;
  public listWorkExperiences : any = [];
  public listSkills : any = [];
  public listSchools : any = [];
  public listCertifications : any = [];
  public listLanguajes : any = [];


  public loadingListWorkExperiences = false;
  styleSheet: string = '';
  public isLoadingLanguaje: boolean = false;
  isLoadingcurrentUser: boolean = false;
  isLoadingGetSkills: boolean = false;
  isLoadingGetSchool: boolean = false;
  isLoadingGetCertifications: boolean = false;
  
  constructor(
    private modalService: NzModalService,
    private cvService : CVUserService,
    private genericService : GenericService,
    private authenticationService: AuthService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private actRoute: ActivatedRoute,
    private ngxSpinner: NgxSpinnerService,
    private http : HttpClient,
    private readonly meta: Meta,
    private readonly title: Title,   
  ) {

    


   }

  ngOnInit(): void {

    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      this.userId = this.user.id;
      this.username = this.actRoute.snapshot.params.id;
      this.title.setTitle("buscando...")
      // this.getStates();
  
      this.loadingListWorkExperiences = true;
      this.isLoadingGetSkills = true;
      this.isLoadingGetSchool = true;
      this.isLoadingGetCertifications = true;
      this.isLoadingLanguaje = true;

      this.getCurrentUser(this.username);

      
    } else {
      this.router.navigateByUrl("/auth/login");
    }

    this.http.get('../../../assets/styles/print-pdf.css', {responseType: 'text'}).subscribe(
      styleSheet => {
        this.styleSheet = styleSheet;
      }
    )

  }


  
  getskillsByUser(id : any) {
    this.cvService.getSkillsByUser(id).subscribe(
      (response: any) => {
       this.listSkills = [];
       response.forEach((prop: any, key: any) => {
          this.listSkills.push(prop.value)   
       }); 

        this.isLoadingGetSkills = false;       
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar las skills');
        this.isLoadingGetSkills = false;
      }
    )
  }


  getWorkExperiencesByUser(id : any) {

    this.ngxSpinner.show();
    this.cvService.workExperiencesByUser(id).subscribe(
      (response: any) => {  
        this.listWorkExperiences = response;
        this.loadingListWorkExperiences = false;
        this.ngxSpinner.hide();       
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar las experiencias de trabajo');
        this.loadingListWorkExperiences = false;
        this.ngxSpinner.hide();
      }
    )
  }


  getSchoolsByUser(id : any) {
    this.cvService.getSchoolsByUser(id).subscribe(
      (response: any) => {
       this.listSchools = response;
        this.isLoadingGetSchool = false;       
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar las escuelas');
        this.isLoadingGetSchool = false;
      }
    )
  }

  public getLanguajes(userId: any) {
    this.cvService.getLanguajesAll(userId).subscribe(
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
  
  getCertificationsByUser(id : any) {
    this.cvService.getCertificationsByUser(id).subscribe(
      (response: any) => {
       this.listCertifications = response;
        this.isLoadingGetCertifications = false;       
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar las certificaciones');
        this.isLoadingGetCertifications = false;
      }
    )
  }


  getCurrentUser(username : any) {
    this.isLoadingcurrentUser = true;
    this.authenticationService.getCurrentUserById(username).subscribe(
      (response: any) => {
        console.log(response);
        
       this.userInformation = response;
       this.previewImage = 'https://t4.ftcdn.net/jpg/04/83/90/95/360_F_483909569_OI4LKNeFgHwvvVju60fejLd9gj43dIcd.jpg';
       this.isLoadingcurrentUser = false;  
       
      this.getWorkExperiencesByUser(response.id);
      this.getskillsByUser(response.id);
      this.getSchoolsByUser(response.id);
      this.getCertificationsByUser(response.id);
      this.getLanguajes(response.id);
      this.title.setTitle(response.surnames);
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar los estados');
        this.isLoadingcurrentUser = false;
      }
    )
  }

  

 public printPDF() {
  const printArea : HTMLElement | null = document.getElementById('pdf');
  // node?.appendChild(printArea!);

  const printWindow = window.open("", "PRINT")!;
  // printWindow.document.write(`<html lang="en"><head></head><body></body>${printArea?.innerHTML}</html>`);
  printWindow.document.write(`<html lang="en"><head><style> ${this.styleSheet} </style> </head><body></body>${printArea?.innerHTML}</html>`);
  printWindow.document.close();
  printWindow.document.close();
  // printWindow.focus();
  printWindow.document.title = this.userInformation.username;
  printWindow.print();
 }


}
