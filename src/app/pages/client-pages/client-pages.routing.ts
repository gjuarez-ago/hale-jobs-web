import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { CvProfileComponent } from './cv-profile/cv-profile.component';
import { SettingsProfileComponent } from './settings-profile/settings-profile.component';
import { MyPostulationsComponent } from './my-postulations/my-postulations.component';
import { MyHistoryComponent } from './my-history/my-history.component';
import { MyNotificationsComponent } from './my-notifications/my-notifications.component';
import { AuthGuard } from 'src/app/guard/auth.guard';

const routes: Routes = [
    {
        path: 'profile', component: MyProfileComponent, children: [
            { path: 'cv', component: CvProfileComponent },
            { path: 'settings-profile', component: SettingsProfileComponent },
            { path: 'my-postulations', component: MyPostulationsComponent },
            { path: 'my-history', component: MyHistoryComponent },
            { path: 'notifications', component: MyNotificationsComponent },   
        ],
        canActivate: [ AuthGuard ]    
    },    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientRoutingModule { }
