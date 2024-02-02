import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxModulesComponents } from 'src/app/modules/ngx-modules-component';
import { NgZoroModulesComponents } from 'src/app/modules/ngzoro-modules-component';

import { ClipboardModule } from '@angular/cdk/clipboard';

import { SideMenuRh } from '../../components/side-menu-rh/side-menu-rh.component';
import { RhDashboardComponent } from './rh-dashboard/rh-dashboard.component';
import { RhOffersComponent } from './rh-offers/rh-offers.component';
import { RhCompanyComponent } from './rh-company/rh-company.component';
import { RhSearchWorkersComponent } from './rh-search-workers/rh-search-workers.component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { ChartsModule } from 'ng2-charts';
import { NewOfferComponent } from './rh-offers/new-offer/new-offer.component';
import { NewCompanyComponent } from './rh-company/new-company/new-company.component';
import { UpdateCompanyComponent } from './rh-company/update-company/update-company.component';
import { UpdateOfferComponent } from './rh-offers/update-offer/update-offer.component';
import { ViewProfileComponent } from './rh-search-workers/view-profile/view-profile.component';

const welcomeComponents: any = [
  SideMenuRh,
  RhDashboardComponent,
  RhOffersComponent,
  RhCompanyComponent,
  RhSearchWorkersComponent,
  NewOfferComponent,
  NewCompanyComponent,
  UpdateCompanyComponent,
  UpdateOfferComponent, 
  ViewProfileComponent,

]

@NgModule({
  declarations: [
    welcomeComponents,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxModulesComponents,
    NgZoroModulesComponents,
    RouterModule,
    ComponentsModule,
    ChartsModule,
    ClipboardModule,
  ],
  exports: [
    welcomeComponents,
    ReactiveFormsModule,
    NgxModulesComponents,
    NgZoroModulesComponents,
    ChartsModule
  ]
})
export class RhModule { }
