import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from "@angular/forms";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './header/header.component';
import {HomeComponent} from './home/home.component';
import {FooterComponent} from './footer/footer.component';
import {ContactFormComponent} from './contact-form/contact-form.component';
import {GestionComponent} from './gestion/gestion.component';
import {Error404Component} from './error404/error404.component';
import {HttpClientModule} from "@angular/common/http";
import {ProjectHomeComponent} from './project-home/project-home.component';
import {AmIVisibleDirective} from "./home/am-ivisible.directive";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    ContactFormComponent,
    GestionComponent,
    Error404Component,
    ProjectHomeComponent,
    AmIVisibleDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
