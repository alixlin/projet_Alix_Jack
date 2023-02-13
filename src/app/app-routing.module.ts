import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ContactFormComponent} from "./contact-form/contact-form.component";
import {GestionComponent} from './gestion/gestion.component';
import {Error404Component} from './error404/error404.component';
import {ProjectHomeComponent} from "./project-home/project-home.component";
import {DetailsComponent} from "./details/details.component";
import {LoginComponent} from "./login/login.component";
import {AuthenticationGuard} from "./guards/authentication.guard";
import {RegisterComponent} from "./register/register.component";
import {FavoriteComponent} from "./favorite/favorite.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'details/:id', component: DetailsComponent},
  {path: 'login', component: LoginComponent, canActivate: [AuthenticationGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [AuthenticationGuard]},
  {path: 'favorite', component: FavoriteComponent},
  // {path: 'home/search/:mealName', component: HomeComponent} ne sert à rien ?
  {path: 'home/search/:mealName', component: HomeComponent},
  {path: 'projecthome', component: ProjectHomeComponent},
  {path: 'gestion', component: GestionComponent},
  {path: '404', component: Error404Component},
  {path: 'contact-form', component: ContactFormComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
