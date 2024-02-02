//*modules

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import { es_ES } from 'ng-zorro-antd/i18n';

import es from '@angular/common/locales/es';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { SliderModule } from 'primeng/slider';
import { ChartsModule } from 'ng2-charts';
import { AuthModule } from './pages/auth/auth.module';
import { GlobalPagesModule } from './pages/global-pages/global-pages.module';
import { RhModule } from './pages/rh-pages/rh.module';
import { ComponentsModule } from './components/components.module';
import { ClientPagesModule } from './pages/client-pages/client-pages.module';
import { NgZoroModulesComponents } from './modules/ngzoro-modules-component';
import { NgxModulesComponents } from './modules/ngx-modules-component';

//* components in-wait

import { AppComponent } from './app.component';
import { NavbarFixedComponent } from './components/navbar-fixed/navbar-fixed.component';

registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent,
    NavbarFixedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IvyCarouselModule,
    ChartsModule,
    // Prime Modules
    SliderModule,
    // End 
    IconsProviderModule,
    NgZoroModulesComponents,
    NgxModulesComponents,
    AuthModule,
    GlobalPagesModule,
    RhModule,
    ComponentsModule,
    ClientPagesModule
  ],
  providers: [{ provide: NZ_I18N, useValue: es_ES }],
  bootstrap: [AppComponent]
})
export class AppModule { }
