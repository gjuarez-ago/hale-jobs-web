import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/core/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-new-company',
  templateUrl: './new-company.component.html',
  styleUrls: ['./new-company.component.css'],
})
export class NewCompanyComponent implements OnInit {
  
  
  public user: User| undefined;
  public userId : any;
  public subcriptions: Subscription[] = [];

  @ViewChild('f') myForm: NgForm | undefined;
  public createForm!: FormGroup;

  public previewVisible: boolean = false;
  public previewImage? : string | ArrayBuffer | null = "https://placehold.jp/150x150.png";
  public imgLoad : File | undefined;
  public isLoadingGeneral: boolean = false;
  public show : any = true;
  public switchValue1 : any = true;

  public listRegimen = [
    {
      id: 601,
      regimen: 'General de Ley Personas Morales',
    },
    {
      id: 603,
      regimen: 'Personas Morales con Fines no Lucrativos',
    },
    {
      id: 605,
      regimen: 'Sueldos y Salarios e Ingresos Asimilados a Salarios',
    },
    {
      id: 606,
      regimen: 'Arrendamiento',
    },
    {
      id: 607,
      regimen: 'Régimen de Enajenación o Adquisición de Bienes',
    },
    {
      id: 608,
      regimen: 'Demás ingresos',
    },
    {
      id: 609,
      regimen: 'Consolidación',
    },
    {
      id: 610,
      regimen:
        'Residentes en el Extranjero sin Establecimiento Permanente en México',
    },
    {
      id: 611,
      regimen: 'Ingresos por Dividendos (socios y accionistas)',
    },
    {
      id: 612,
      regimen: 'Personas Físicas con Actividades Empresariales y Profesionales',
    },
    {
      id: 614,
      regimen: 'Ingresos por intereses',
    },
    {
      id: 615,
      regimen: 'Régimen de los ingresos por obtención de premios',
    },

    {
      id: 615,
      regimen: 'Sin obligaciones fiscales',
    },
    {
      id: 616,
      regimen:
        'Sociedades Cooperativas de Producción que optan por diferir sus ingresos',
    },
    {
      id: 621,
      regimen: 'Incorporación Fiscal',
    },
    {
      id: 622,
      regimen: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras',
    },

    {
      id: 623,
      regimen: 'Opcional para Grupos de Sociedades',
    },
    {
      id: 624,
      regimen: 'Coordinados',
    },
    {
      id: 625,
      regimen:
        'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas',
    },
    {
      id: 626,
      regimen: 'Régimen Simplificado de Confianza',
    },

    {
      id: 628,
      regimen: 'Hidrocarburos',
    },

    {
      id: 629,
      regimen:
        'De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales',
    },
    {
      id: 630,
      regimen: 'Enajenación de acciones en bolsa de valores',
    },
  ];

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

  public listSize = [
    {
      id: 1,
      size: "De 1 a 10 personas",
    },
    {
      id: 2,
      size: "De 11 a 100 personas",
    },
    {
      id: 3,
      size: "De 101 a 250 personas",
    },
    {
      id: 4,
      size: "De 251 a 500 personas",
    },
    {
      id: 5,
      size: "De 501 a 1000 personas",
    },
    {
      id: 6,
      size: "Más de 1001 personas",
    },
  ]
  
  constructor(
    private authenticationService: AuthService,
    private companyService : CompanyService,
    private message: NzMessageService,
    private router: Router,
    private ngxSpinner: NgxSpinnerService
  ) {
    this.createForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
      address: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(70)]),
      category: new FormControl(null,[Validators.required]),
      description: new FormControl(null, [Validators.required, Validators.minLength(20), Validators.maxLength(400)]),
      // ownerId: new FormControl(null, Validators.required),
      regimenFiscal: new FormControl(null, [Validators.required]),
      rfc: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(13)]),
      size: new FormControl(null, Validators.required),
      urlLinkedin: new FormControl(null, [Validators.required, Validators.minLength(20), Validators.maxLength(150)]),
      urlSite: new FormControl(null, [Validators.required, Validators.minLength(20), Validators.maxLength(150)]),
      showCompany: new FormControl(true),
      numberPhone: new FormControl(null, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.minLength(10), Validators.maxLength(10)]),
      emailContact : new FormControl(null, [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(50)]),
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

  public onBack() {
    this.router.navigateByUrl('/dashboard/my-company');
  }

  public submitForm() {
    for (const i in this.createForm.controls) {
      if (this.createForm.controls.hasOwnProperty(i)) {
        this.createForm.controls[i].markAsDirty();
        this.createForm.controls[i].updateValueAndValidity();
      }
    }

    if (!this.createForm.valid) {
      this.createMessage('warning', 'Es necesario llenar todos los campos!');
      return;
    }

    if(!this.imgLoad) {
      this.createMessage('warning', 'Es necesario cargar la imagen de perfil!');
      return;
    }

    let form = this.createForm.value;

    console.log(this.switchValue1);
    
    

    const formData = new FormData();
    formData.append("image", this.imgLoad);
    formData.append("address", form.address);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("name", form.name);    
    formData.append("ownerId", this.userId);
    formData.append("showCompany", this.switchValue1);    
    formData.append("regimenFiscal", form.regimenFiscal);
    formData.append("rfc", form.rfc);
    formData.append("size", form.size);
    formData.append("urlLinkedin", form.urlLinkedin);
    formData.append("urlSite", form.urlSite);
    formData.append("numberPhone", form.numberPhone);
    formData.append("emailContact", form.emailContact);

    this.isLoadingGeneral = true;
    this.ngxSpinner.show();

    this.companyService.createCompany(formData).subscribe(
      (response: any) => {
        this.message.create("success", 'Empresa creada correctamente!');
        this.isLoadingGeneral=false;
        this.ngxSpinner.hide();
        this.createForm.reset();
        this.imgLoad = undefined;
        this.previewImage = "https://placehold.jp/150x150.png";
        this.router.navigateByUrl('/dashboard/my-company');
      },
      (errorResponse: HttpErrorResponse) => {
        this.message.create("error",  errorResponse.error.message);
        this.isLoadingGeneral=false;
        this.ngxSpinner.hide();
      }
    )
  }

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  
  async handleChange(event:any){
    this.previewVisible = false;
    // this.previewImage = "";

    const file:File = event.target.files[0];
    const isImg = file.type === 'image/png' || file.type === 'image/jpeg'

    if (!isImg) {
      this.message.error('Disculpa, Solo se aceptan Imagenes Jpg/png ');
      this.isLoadingGeneral = false;
      return;
    }

    this.imgLoad = event.target.files[0];
    this.previewImage  = await getBase64(this.imgLoad!);
    this.previewVisible = true;
  }


}


const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});