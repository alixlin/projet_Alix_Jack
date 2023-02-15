import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {Service} from "../../DataService/service";
import {
  filter,
  fromEvent, lastValueFrom,
  map,
  of, Subscription,
  switchMap
} from "rxjs";
import {Meal} from "../model/Meal";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {mealQuery, queryResponse} from "../model/queryResponse";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private el: ElementRef,
              private service: Service,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              public authService: AuthenticationService,
  ) {
  }

  public mealsSample: Meal[] = [];
  private subscription?: Subscription;
  private mealList: Meal[] = [];
  private favoriteList: string[] = [];

  ngOnInit() {
    this.favoriteList = this.getIdMeals(this.authService.authenticatedUser?.favorite ?? []);

    const divElement = this.el.nativeElement.querySelector('#divDetector');
    const scroll$ = fromEvent(window, 'scroll');
    this.subscription = scroll$.pipe(
      map(() => divElement.getBoundingClientRect()),
      switchMap(rect => {
        if (rect.top >= 0 && rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)) {
          return of(true);
        } else {
          return of(false);
        }
      }),
      filter(isVisible => isVisible)
    ).subscribe(() => {
      this.getMealSample();
    });

    this.activatedRoute.queryParams.subscribe(async (params: Params) => {
      const defaultMealList = await lastValueFrom(this.service.fetchMealsList());

      const areaList: queryResponse = params['area'] && params['area'] != 'allArea' ? await lastValueFrom(this.service.fetchAreaByName(params['area'])) : defaultMealList;
      const areaIdList: string[] = this.getIdMeals2(areaList.meals);

      const categoryList: queryResponse = params['category'] && params['category'] != 'allCategory' ? await lastValueFrom(this.service.fetchCategoryByName(params['category'])) : defaultMealList;
      const categoryIdList: string[] = this.getIdMeals2(categoryList.meals);

      const searchName: string = params['mealName']?.trim();
      const searchList: queryResponse = searchName ? await lastValueFrom(this.service.fetchMealsListBy(searchName)) : defaultMealList;
      const searchIdList: string[] = this.getIdMeals2(searchList.meals || []);

      let ingredientName: string[] = [];
      if (params['ingredient'] && params['ingredient'].length > 0) {
        Array.isArray(params['ingredient']) ? ingredientName = params['ingredient'] : ingredientName[0] = params['ingredient'];
      }
      const ingredientIdList: string[] = ingredientName.length > 0 ? await this.getIdIngredient(ingredientName) : this.getIdMeals2(defaultMealList.meals);

      const interQuery: string[] = this.intersection(this.intersection(areaIdList, categoryIdList), this.intersection(ingredientIdList, searchIdList));
      const finalQuery: Meal[] = this.getCommonElements3(interQuery, defaultMealList.meals);
      this.mealList = finalQuery;
      this.mealsSample = [];
      this.getMealSample();
    });


  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public addCart(meal: Meal) {
    if (this.authService.isAuthenticated()) {
      return this.authService.addCart(meal);
    } else {
      return this.router.navigateByUrl("/login");
    }
  }

  public addFavorite(meal: Meal) {
    if (this.authService.isAuthenticated()) {
      this.authService.addFavorite(meal);
      this.favoriteList = this.getIdMeals(this.authService.authenticatedUser?.favorite ?? []);
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  public removeFavorite(idMeal: string) {
    const index = this.favoriteList.indexOf(idMeal);
    this.authService.removeFavorite(index);
    this.favoriteList = this.getIdMeals(this.authService.authenticatedUser?.favorite ?? []);
  }

  public isInFavoriteList(idMeal: string): boolean {
    return this.favoriteList.includes(idMeal ?? "");
  }

  public openMealDetails(id: string): void {
    this.router.navigate(['details', id]);
  }

  private getMealSample() {
    this.mealsSample = this.mealsSample.concat(this.mealList.slice(this.mealsSample.length, this.mealsSample.length + 10));
  }


  private getCommonElements3(array1: any[], array2: any[]) {
    return array2.filter(object => array1.includes(object.idMeal));
  }

  private getIdMeals(meals: Meal[]): string[] {
    return meals.map(meal => meal.idMeal);
  }

  private getIdMeals2(meals: mealQuery[]): string[] {
    return meals.map(meal => meal.idMeal);
  }

  private async getIdIngredient(ingredientNameList: string[]) {
    const firstQuery: queryResponse = await lastValueFrom(this.service.fetchIngredientByName(ingredientNameList[0]));
    let ingredientIdList: string[] = this.getIdMeals2(firstQuery.meals);
    for (let i = 0; i < ingredientNameList.length - 1; i++) {
      const otherQuery: queryResponse = await lastValueFrom(this.service.fetchIngredientByName(ingredientNameList[i + 1]));
      const otherIngredientIdList: string[] = this.getIdMeals2(otherQuery.meals);
      ingredientIdList = this.intersection(ingredientIdList, otherIngredientIdList);
    }
    return ingredientIdList;

  }

  private intersection(array1: string[], array2: string[]): string[] {
    return array1.filter(value => array2.includes(value));
  }

}
