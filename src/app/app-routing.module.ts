import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import { ListeComponent } from './liste/liste.component';
import {ContactFormComponent} from "./contact-form/contact-form.component";
import { GestionComponent } from './gestion/gestion.component';
import { Error404Component } from './error404/error404.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'liste', component: ListeComponent },
  { path: 'gestion', component: GestionComponent },
  { path: '404', component: Error404Component },
  { path: 'contact-form', component: ContactFormComponent},
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
