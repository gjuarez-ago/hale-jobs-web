import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SideMenuRh } from '../../components/side-menu-rh/side-menu-rh.component';
import { RhDashboardComponent } from './rh-dashboard/rh-dashboard.component';
import { RhOffersComponent } from './rh-offers/rh-offers.component';
import { RhCompanyComponent } from './rh-company/rh-company.component';
import { RhSearchWorkersComponent } from './rh-search-workers/rh-search-workers.component';
import { NewOfferComponent } from './rh-offers/new-offer/new-offer.component';
import { NewCompanyComponent } from './rh-company/new-company/new-company.component';
import { UpdateCompanyComponent } from './rh-company/update-company/update-company.component';
import { UpdateOfferComponent } from './rh-offers/update-offer/update-offer.component';
import { ViewProfileComponent } from './rh-search-workers/view-profile/view-profile.component';

const routes: Routes = [
    {
        path: 'dashboard', component: SideMenuRh, children: [
          
          { path: "my-statistics", component: RhDashboardComponent },
          { path: "my-offers", component: RhOffersComponent},
          { path: "new-offer", component: NewOfferComponent },
          { path: "update-offer/:id", component: UpdateOfferComponent },
          
          { path: "my-company", component: RhCompanyComponent },
          { path: "new-company", component: NewCompanyComponent },
          { path: "update-company/:id", component: UpdateCompanyComponent },

          { path: "search-workers", component: RhSearchWorkersComponent },
          { path: "view-worker/:id", component: ViewProfileComponent },
          

          { path: "statisticts", component: RhDashboardComponent },
          // { path: "offers-formals", component: AdminOffersComponent },
          // { path: "admin-comments", component: AdminCommentsComponent },
          // { path: "admin-complaints", component: AdminComplaintsComponent },
          // { path: "admin-payments", component: AdminPaymentsComponent },
          // { path: "admin-postulations-i", component: AdminPostulationsIComponent },
          // { path: "admin-postulations-f", component: AdminPostulationsComponent },
          // { path: "reviews-b", component: AdminReviewsByBusinessComponent },
          // { path: "reviews-p", component: AdminReviewsByUserComponent },
          // { path: "worker-experiences", component: AdminWorkersExperiencesComponent },
          // { path: "admin-notifications", component: AdminNotficationsComponent },
          // { path: "admin-companies", component: AdminOpinionsByCompanyComponent },
          // { path: "admin-users", component: AdminUsersComponent },
    
          // // Catalogs
          // { path: "permissions", component: AdminPermissionsComponent },
          // { path: "type-of-payments", component: AdminTypeOfPaymentsComponent },
          // { path: "type-of-jobs", component: AdminTypeOfJobComponent },
          
          // { path: "faq", component: AdminPermissionsComponent },
          // { path: "privacy", component: AdminPermissionsComponent },
    
          { path: '', pathMatch: 'full', redirectTo: '/auth/login' },
        ],
        // canActivate: [ AuthGuard ]
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RhRoutingModule {}
