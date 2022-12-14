import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import { ListeComponent } from './liste/liste.component';
import {ContactFormComponent} from "./contact-form/contact-form.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'liste', component: ListeComponent },
  { path: 'contact-form', component: ContactFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
