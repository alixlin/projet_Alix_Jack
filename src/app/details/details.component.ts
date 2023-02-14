import {Component, OnInit,} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Service} from "../../DataService/service";
import {Meal} from "../model/Meal";


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private service: Service, private router: Router) {
  }

  public meal?: Meal;
  public ingredientsAndMeasures: string[][] = [];

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.getMealDetails(params['id']);
    });
  }

  private getMealDetails(id: string) {
    this.service.fetchMealById(id).subscribe((rslt: any) => {
      if (!rslt.meals) {
        this.router.navigateByUrl('/404');
      } else {
        this.meal = rslt.meals[0];
        for (let i = 0; i < 20; i++) {
          const count = i + 1
          const ingredient = "strIngredient" + count.toString();
          const measure = "strMeasure" + count.toString();
          this.ingredientsAndMeasures[i] = [rslt.meals[0][ingredient], rslt.meals[0][measure]];
        }
      }
    });
  }
}
