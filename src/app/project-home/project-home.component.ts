import { Component, OnInit } from '@angular/core';
import {Test} from "../model/test";
import {Service} from "../../DataService/service";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-project-home',
  templateUrl: './project-home.component.html',
  styleUrls: ['./project-home.component.scss']
})
export class ProjectHomeComponent implements OnInit {

  public toto?:Test;

  constructor(private service: Service) { }

  async ngOnInit() {
    this.toto = await lastValueFrom(this.service.getConfig());
    console.log(this.toto);
  }

}
