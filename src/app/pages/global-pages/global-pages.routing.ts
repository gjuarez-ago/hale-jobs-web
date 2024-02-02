import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { SearchOffersComponent } from './search-offers/search-offers.component';
import { SearchCompaniesComponent } from './search-companies/search-companies.component';
import { SupportCandidatesComponent } from './support-candidates/support-candidates.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PrivacyPoliciesComponent } from './privacy-policies/privacy-policies.component';
import { DetailsCompanieComponent } from './search-companies/details-companie/details-companie.component';
import { FaqComponent } from './faq/faq.component';
import { ViewOfferComponent } from './view-offer/view-offer.component';
import { RhSellComponent } from './rh-sell/rh-sell.component';


const routes: Routes = [
    {
        path: '', component: NavbarComponent, children: [
          // Global pages
          { path: '', pathMatch: 'full', redirectTo: '/home' },
          { path: 'home', component: HomeComponent },
          { path: 'search', component: SearchOffersComponent },
          { path: 'companies', component: SearchCompaniesComponent},
          { path: 'companies/:id', component: DetailsCompanieComponent},
          { path: 'support-candidates', component: SupportCandidatesComponent },
          { path: "terms-and-conditions", component: TermsConditionsComponent },
          { path: "view-job/:id", component: ViewOfferComponent },
          { path: "privacy-policies", component: PrivacyPoliciesComponent },
          // { path: 'view/:id', component: ViewOfferComponent },
          { path: "rh-sells", component: RhSellComponent },

        ],
        data: { animation: 'HomePage' }
      },
      { path: 'faq', component: FaqComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GlobalRoutingModule {}
