import {
  Component,
  ElementRef,
  OnInit, Renderer2,
  ViewChild,
} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Service} from "../../DataService/service";
import {Meal} from "../model/Meal";
import {trigger, style, animate, transition} from '@angular/animations';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  meal?: Meal;
  ingredientsAndMeasures: any[] = [];

  constructor(private activatedRoute: ActivatedRoute, private service: Service, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.getMealDetails(params['id']);
    });
  }

  getMealDetails(id: string) {
    this.service.fetchMealById(id).subscribe((rslt) => {
      this.meal = rslt.meals[0];
      for (let i = 0; i < 20; i++) {
        const count = i + 1
        const ingredient = "strIngredient" + count.toString();
        const measure = "strMeasure" + count.toString();
        this.ingredientsAndMeasures[i] = [rslt.meals[0][ingredient], rslt.meals[0][measure]];
      }
      console.log(this.meal);
    });
  }

}
