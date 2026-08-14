import { Routes } from '@angular/router';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ProfileComponent } from './components/profile/profile.component';

import { UserGuardService } from './services/accounts/guard/user-guard/user-guard-service.service';
import { GuestGuardService } from './services/accounts/guard/guest-guard/guest-guard-service.service';
import { AdminGuardService } from './services/accounts/guard/admin-guard/admin-guard-service.service';
import { ListComponent } from './components/list/list.component';
import { ProductDetailComponent } from './components/detail-product/detail-product.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [UserGuardService] },
    { path: 'profile', component: ProfileComponent, canActivate: [UserGuardService] },
    { path: 'welcome', component: WelcomeComponent, canActivate: [GuestGuardService] },
    { path: 'sign-in', component: SignInComponent},
    { path: 'sign-up', component: SignUpComponent },
    { path: 'list', component: ListComponent},
    { path: 'product/:id', component: ProductDetailComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AdminGuardService] },
    { path: '**', redirectTo: 'home' },// Others URL
];