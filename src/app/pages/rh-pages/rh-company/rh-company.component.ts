import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/core/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-rh-company',
  templateUrl: './rh-company.component.html',
  styleUrls: ['./rh-company.component.css']
})
export class RhCompanyComponent implements OnInit {

  // * Variables de la tabla
  public pageSize: number = 6;
  public current: number = 1;
  public subscriptions: Subscription[] = [];
  public total: number = 0;
  public totalElementByPage = 0;
  public data: any[] = [];
    
  public user: User| undefined;
  public userId : any;

  //  public data : Content[] = [];
  //  public temp : Content[] = [];
  public isLoadingTable = false;

  // * Variables genericas  
  public isLoadingGeneral = false;

  // * Variables para realizar el filtrado
  public validateForm!: FormGroup;

  public visible = false;
  public viewCompany: any;
  public isLoadingView : any = false;


  constructor(
    private companyService : CompanyService,
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private ngxSpinner: NgxSpinnerService
  ) {

    this.validateForm = this.fb.group({
      name: [''],
      rfc: [''],
      category: [''],
    });

  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
      this.userId = this.user.id;
      this.getListPaginate();
    } else {
      this.router.navigateByUrl("/auth/login");
    }
  }


  submitForm(): void {

  for (const i in this.validateForm.controls) {
    if (this.validateForm.controls.hasOwnProperty(i)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  if (!this.validateForm.valid) {
    this.createMessage('warning', 'Es necesario llenar todos los campos!');
    return;
  }

  this.ngxSpinner.show();
  let form = this.validateForm.value;
  this.data = [];
  this.total = 0;
 
  this.isLoadingTable = true;
  this.isLoadingGeneral = true;
  this.subscriptions.push(
    this.companyService
      .getCompaniesByOwner({
        pageNo: this.current - 1,
        pageSize: this.pageSize,
        ownerId: this.userId,
        name: form.name,
        category: form.category ? form.category : '', 
        rfc: form.rfc
      })
      .subscribe(
        (response: any) => {

          this.data = response.content.map((prop: any, key: any) => {
            return {
              ...prop,
              imageBase64: 'data:image/png;base64,' + prop.imageBase64,
              key: key + 1,
            };
          });

          this.isLoadingGeneral = false;
          this.total = response.totalElements;
          this.totalElementByPage = response.numberOfElements;
          this.isLoadingTable = false;
          this.ngxSpinner.hide();
       
        },
        (errorResponse: HttpErrorResponse) => {
          this.isLoadingTable = false;
          this.isLoadingGeneral = false;
          this.message.create('error', errorResponse.error.message);
          this.ngxSpinner.hide();
        }
      )
  )}

  public navigateCreate() {
      this.router.navigateByUrl('/dashboard/new-company');
  }

  getListPaginate(): void {
    this.isLoadingTable = true;
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.companyService
        .getCompaniesByOwner({
          pageNo: this.current - 1,
          pageSize: this.pageSize,
          ownerId: this.userId,
          name: this.validateForm.value["name"],
          category: this.validateForm.value["category"] ? this.validateForm.value["category"] : '' , 
          rfc: this.validateForm.value["rfc"]
        })
        .subscribe(
          (response: any) => {
            this.data = response.content.map((prop: any, key: any) => {
              return {
                ...prop,
                imageBase64: 'data:image/png;base64,' + prop.imageBase64,
                key: key + 1,
              };
            });
            this.total = response.totalElements;
            this.totalElementByPage = response.numberOfElements;
            this.isLoadingTable = false;
            this.isLoadingGeneral = false;
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingTable = false;
            this.isLoadingGeneral = false;
            this.message.create('error', errorResponse.error.message);
          }
        )
    );
  }

  changePageSize($event: number): void {
    this.pageSize = $event;
    this.getListPaginate();
  }

  changeCurrentPage($event: number): void {
    this.current = $event;
    this.getListPaginate();
  }
  
  public info(element : any): void {
    this.modal.warning({
      nzTitle: `¿Seguro que deseas eliminar la siguiente empresa (${element.name})?`,
      // nzContent: 'Bla bla ...',
      nzOkText: 'Eliminar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.deleteUserById(element);
      },
    });
  }

  public openViewDrawer(item : any): void {
    this.getCompanyById(item);
    this.visible = true;

  }

  public closeViewDrawer(): void {
    this.visible = false;
  }

  private deleteUserById(element : any) {

    this.isLoadingTable = true;
    this.isLoadingGeneral = true;
    this.subscriptions.push(
      this.companyService
        .deleteCompanyById(element.id)
        .subscribe(
          (response: any) => {
            this.message.create('success', "Empresa eliminada correctamente");
            this.getListPaginate();
            this.isLoadingTable = false;
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingTable = false;
            this.isLoadingGeneral = false;
            this.message.create('error', errorResponse.error.message);
          }
        )
    );
  }

  private getCompanyById(element : any) {
    this.isLoadingView = true;
    this.subscriptions.push(
      this.companyService
        .getCompanyById(element.id)
        .subscribe(
          (response: any) => {
            this.viewCompany = response;
            this.isLoadingView = false;
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingView = false;
            this.message.create('error', errorResponse.error.message);
          }
        )
    );
  }

  public updateRouter(item : any) {
    this.router.navigateByUrl(``)
  }

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  
  public listCategory = [
    {
      id: 1,
      name: "Tecnologías de la información - Sistemas"
    },
    {
      id: 2,
      name: "Administrativo"
    },
    {
      id: 3,
      name: "Ventas"
    },
    {
      id: 4,
      name: "Contabilidad - Finanzas"
    },
    {
      id: 5,
      name: "Atencion a clientes - Call Center"
    },
    {
      id: 6,
      name: "Ingeniería"
    },
    {
      id: 7,
      name: "Manufactura, Producción y Operaciones"
    },
    {
      id: 8,
      name: "Logística, Transporte, Distribución y Almacén"
    },
    {
      id: 9,
      name: "Mercadotecnia, Publicidad, Relaciones Públicas"
    },
    {
      id: 10,
      name: "Recursos Humanos"
    },
    {
      id: 11,
      name: "Sector salud"
    },
    
    {
      id: 12,
      name: "Construcción,Inmobilaria o Arquitectura"
    },
    {
      id: 13,
      name: "Servicios generales, Oficios y Seguridad"
    },  
    {
      id: 14,
      name: "Seguros y reaseguros"
    },
    {
      id: 15,
      name: "Derecho y leyes"
    },
    {
      id: 16,
      name: "Educación"
    },
    {
      id: 16,
      name: "Arte y diseño"
    },
    {
      id: 17,
      name: "Turismo, Hoteleria, Hospitabilidad y Gastronomía"
    },
    {
      id: 18,
      name: "Medios digitales, Comunicación y creatividad"
    },
    {
      id: 19,
      name: "Veterinaria y Agricultura"
    },
    {
      id: 20,
      name: "Minería,Energía o Recursos naturales "
    },
    {
      id: 21,
      name: "Deportes, Salud y belleza "
    },


  ]

}
