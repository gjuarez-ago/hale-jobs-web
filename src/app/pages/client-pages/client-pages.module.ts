import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { CvProfileComponent } from './cv-profile/cv-profile.component';
import { SettingsProfileComponent } from './settings-profile/settings-profile.component';
import { MyPostulationsComponent } from './my-postulations/my-postulations.component';
import { MyHistoryComponent } from './my-history/my-history.component';
import { MyNotificationsComponent } from './my-notifications/my-notifications.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZoroModulesComponents } from 'src/app/modules/ngzoro-modules-component';
import { NgxModulesComponents } from 'src/app/modules/ngx-modules-component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';

const clientPagesComponents: any = [
  MyProfileComponent,
  CvProfileComponent,
  SettingsProfileComponent,
  MyPostulationsComponent,
  MyHistoryComponent,
  MyNotificationsComponent,
]

@NgModule({
  declarations: [
    clientPagesComponents,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZoroModulesComponents,
    NgxModulesComponents,
    RouterModule,
    ComponentsModule,
    TagModule,
    ChipModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NgZoroModulesComponents,
    NgxModulesComponents,
    clientPagesComponents,
    TagModule
  ]
})
export class ClientPagesModule { }
