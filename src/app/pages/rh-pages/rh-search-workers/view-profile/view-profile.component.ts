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
  


  public loadingListWorkExperiences = false;
  styleSheet: string = '';

  
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
    this.isLoadingGeneral = true;
    this.cvService.getSkillsByUser(id).subscribe(
      (response: any) => {
       this.listSkills = [];
       response.forEach((prop: any, key: any) => {
          this.listSkills.push(prop.value)   
       }); 

        this.isLoadingGeneral = false;       
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar las skills');
        this.isLoadingGeneral = false;
      }
    )
  }


  getWorkExperiencesByUser(id : any) {
    this.loadingListWorkExperiences = true;
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
    this.isLoadingGeneral = true;
    this.cvService.getSchoolsByUser(id).subscribe(
      (response: any) => {
       this.listSchools = response;
        this.isLoadingGeneral = false;       
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar las escuelas');
        this.isLoadingGeneral = false;
      }
    )
  }

  
  getCertificationsByUser(id : any) {
    this.isLoadingGeneral = true;
    this.cvService.getCertificationsByUser(id).subscribe(
      (response: any) => {
       this.listCertifications = response;
        this.isLoadingGeneral = false;       
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar las certificaciones');
        this.isLoadingGeneral = false;
      }
    )
  }


  getCurrentUser(username : any) {
    this.isLoadingGeneral = true;
    this.authenticationService.getCurrentUserById(username).subscribe(
      (response: any) => {
        console.log(response);
        
       this.userInformation = response;
       this.previewImage = response.profileImageUrl == null ? 'https://thumbs.dreamstime.com/z/no-user-profile-picture-24185395.jpg' : response.profileImageUrl;
       this.isLoadingGeneral = false;       

      this.getWorkExperiencesByUser(response.id);
      this.getskillsByUser(response.id);
      this.getSchoolsByUser(response.id);
      this.getCertificationsByUser(response.id);
      this.title.setTitle(response.surnames)

      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error", 'Ha ocurrido un error al recuperar los estados');
        this.isLoadingGeneral = false;
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
