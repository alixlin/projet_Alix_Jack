import { Component, OnInit } from '@angular/core';
import {Service} from "../../DataService/service";
import {Test} from "../model/test";
import {lastValueFrom, Subscription} from "rxjs";

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss']
})
export class Error404Component implements OnInit {

  public toto?:Test;

  constructor(private service: Service) { }

  async ngOnInit() {
    this.toto = await lastValueFrom(this.service.getConfig());
    console.log(this.toto);
  }

}
