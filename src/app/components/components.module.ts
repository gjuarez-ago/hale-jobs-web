import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { PrintCvComponent } from './print-cv/print-cv.component';
import { NzIconModule } from 'ng-zorro-antd/icon';


@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    PrintCvComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NzIconModule
  ],
  exports: [
    PrintCvComponent,
    FooterComponent,
    NavbarComponent
  ]
})
export class ComponentsModule { }
