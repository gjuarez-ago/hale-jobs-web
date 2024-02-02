import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/core/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  
  public isLoadingGeneral = false;

  public current = 0;
  public createForm!: FormGroup;
  public user : User | undefined;
  public idUser !: number;
  public subscriptions : Subscription[] = [];

  public isLoadingSupers = false;
  public isLoadingCategories = false;

  
  constructor(private formBuilder: FormBuilder,  private router: Router,
    private modalService: NzModalService,
    private authenticationService : AuthService,
    ) {

      
    this.createForm = this.formBuilder.group({
      nombreProyecto: ['', Validators.required],
      descripcionProyecto:['', Validators.required],
      idCadena:['', Validators.required],
      idCategoria:['', Validators.required],
      idUsuaario:['', Validators.required],
    });
      
  }


  ngOnInit(): void {
  }


  public submitForm() {

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
    console.log(this.current); 
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

  panels = [
    {
      active: true,
      name: 'This is panel header 1',
      disabled: false
    },
    {
      active: false,
      disabled: false,
      name: 'This is panel header 2'
    },
    {
      active: false,
      disabled: false,
      name: 'This is panel header 3'
    }
  ];

}
