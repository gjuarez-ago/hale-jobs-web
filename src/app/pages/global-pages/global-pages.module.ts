import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqComponent } from './faq/faq.component';
import { HomeComponent } from './home/home.component';
import { PrivacyPoliciesComponent } from './privacy-policies/privacy-policies.component';
import { SearchCompaniesComponent } from './search-companies/search-companies.component';
import { SearchOffersComponent } from './search-offers/search-offers.component';
import { SupportCandidatesComponent } from './support-candidates/support-candidates.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { ViewOfferComponent } from './view-offer/view-offer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZoroModulesComponents } from 'src/app/modules/ngzoro-modules-component';
import { NgxModulesComponents } from 'src/app/modules/ngx-modules-component';
import { RouterModule } from '@angular/router';
import { DetailsCompanieComponent } from './search-companies/details-companie/details-companie.component';
import { RhSellComponent } from './rh-sell/rh-sell.component';

const globalComponets: any = [
  FaqComponent,
  HomeComponent,
  PrivacyPoliciesComponent,
  SearchCompaniesComponent,
  SearchOffersComponent,
  SupportCandidatesComponent,
  TermsConditionsComponent,
  ViewOfferComponent,
  RhSellComponent,
  DetailsCompanieComponent,
]

@NgModule({
  declarations: [
    globalComponets,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgZoroModulesComponents,
    NgxModulesComponents,
    RouterModule
  ],
  exports: [
    globalComponets,
    ReactiveFormsModule,
    FormsModule,
    NgZoroModulesComponents,
    NgxModulesComponents
  ]
})
export class GlobalPagesModule { }
