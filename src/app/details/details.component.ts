import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Service} from "../../DataService/service";
import {Meal} from "../model/Meal";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  meal?:Meal;
  showSidebar = false;

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  constructor(private activatedRoute: ActivatedRoute, private service: Service) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.getMealDetails(params['id']);
    });
  }

  getMealDetails(id: string) {
    this.service.fetchMealById(id).subscribe((rslt) => {
        this.meal = rslt.meals[0];
      console.log(this.meal);
      });
  }

}
