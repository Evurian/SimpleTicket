import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ProfileComponent } from './components/profile/profile.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ListComponent } from './components/list/list.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'welcome', component: WelcomeComponent},
    { path: 'sign-in', component: SignInComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'profile', component: ProfileComponent },
    {path: 'list', component: ListComponent},
    { path: '**', redirectTo: '' },//Others URL
];