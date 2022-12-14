import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./header/home/home.component";
import { ListeComponent } from './header/liste/liste.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {path: 'liste', component: ListeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
