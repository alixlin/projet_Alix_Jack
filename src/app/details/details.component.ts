import {
  Component,
  ElementRef,
  OnInit, Renderer2,
  ViewChild,
} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Service} from "../../DataService/service";
import {Meal} from "../model/Meal";
import {trigger, style, animate, transition} from '@angular/animations';
import {AppUser} from "../model/user";
import {AuthenticationService} from "../service/authentication.service";


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  meal?: Meal;
  ingredientsAndMeasures: any[] = [];

  favoriteList: string[] = [];

  constructor(private activatedRoute: ActivatedRoute, private service: Service, private renderer: Renderer2, public authService: AuthenticationService, private router:Router) {
  }

  ngOnInit() {
    this.favoriteList = this.getIdMeals(this.authService.authenticatedUser?.favorite ?? []);
    this.activatedRoute.params.subscribe(async (params: Params) => {
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
    });
  }

  addFavorite(meal:Meal) {
    this.authService.addFavorite(meal);
    this.favoriteList = this.getIdMeals(this.authService.authenticatedUser?.favorite ?? []);
  }

  addCart(meal:Meal) {
    this.authService.isAuthenticated() ? this.authService.addCart(meal) : this.router.navigateByUrl('/login');
  }

  getIdMeals(meals: Meal[]): string[] {
    return meals.map(meal => meal.idMeal);
  }

  removeFavorite() {
    const index = this.favoriteList.indexOf(this.meal?.idMeal!);
    this.authService.removeFavorite(index);
    this.favoriteList = this.getIdMeals(this.authService.authenticatedUser?.favorite ?? []);
  }

  isInFavoriteList(): boolean {
    return this.favoriteList.includes(this.meal?.idMeal ?? "");
  }


}
