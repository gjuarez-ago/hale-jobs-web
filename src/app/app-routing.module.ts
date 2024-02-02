import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthRoutingModule } from './pages/auth/auth.routing';
import { GlobalRoutingModule } from './pages/global-pages/global-pages.routing';
import { RhRoutingModule } from './pages/rh-pages/rh.routing';
import { ClientRoutingModule } from './pages/client-pages/client-pages.routing';

const routes: Routes = [
  { path: '**', redirectTo: '', pathMatch: 'full' },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      {
        useHash: true,
        scrollPositionRestoration: 'enabled',
        scrollOffset: [0,0]
      }),
    AuthRoutingModule,
    GlobalRoutingModule,
    RhRoutingModule,
    ClientRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
