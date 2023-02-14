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
import {AppUser} from "../model/user";
import {AuthenticationService} from "../service/authentication.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  private subscription?: Subscription;
  public mealsSample: Meal[] = [];
  private mealList: Meal[] = [];

  favoriteList: string[] = [];

  constructor(private el: ElementRef,
              private service: Service,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              public authService: AuthenticationService,
  ) {
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

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
      console.log("hello")
      this.getMealSample();
    });

    // Search bar
    this.activatedRoute.queryParams.subscribe( async (params: Params) => {
      const defaultMealList = await lastValueFrom(this.service.fetchMealsList());
      console.log("params");
      console.log(params);
      console.log(params['ingredient'])
      console.log(params['ingredient'] && params['ingredient'].length > 0 ? "oui il existe" : "nn il existe pas");
      console.log(params['area'] && params['area'] != 'allArea'? "il y a une requete " : "default meals")
      const areaList = params['area'] && params['area'] != 'allArea'? await lastValueFrom(this.service.fetchAreaByName(params['area'])) : defaultMealList;
      console.log(areaList.meals);
      const categoryList = params['category'] && params['category'] != 'allCategory'? await lastValueFrom(this.service.fetchCategoryByName(params['category'])) : defaultMealList;
      console.log(categoryList.meals);
      const ingredientList = params['ingredient'] && params['ingredient'].length > 0 ? await lastValueFrom(this.service.fetchIngredientByName(params['ingredient'])) : defaultMealList;
      const ingredientListError = ingredientList.meals == null ? [] : ingredientList.meals
      console.log(ingredientList.meals);
      const searchList = params['mealName'] && params['mealName'].trim().length > 0 ? await lastValueFrom(this.service.fetchMealsListBy(params['mealName'])) : defaultMealList;
      console.log(searchList);
      console.log(searchList.meals);
      const searchListError = searchList.meals == null ? [] : searchList.meals

      const interAreaAndCategory: string[] = this.getCommonElements(areaList.meals,categoryList.meals);
      const interIngredientAndSearch: string[] = this.getCommonElements(ingredientListError,searchListError);
      const interQuery: string[] = this.getCommonElements2(interAreaAndCategory,interIngredientAndSearch);
      console.log(interAreaAndCategory);
      console.log(interIngredientAndSearch);
      console.log(interQuery);
      console.log(this.getCommonElements3(interQuery,defaultMealList.meals))
      const finalQuery = this.getCommonElements3(interQuery,defaultMealList.meals);
      this.mealList = finalQuery;
      this.mealsSample = [];
      this.getMealSample();

/*
      if (params['mealName'] && params['mealName'].trim().length > 0) {
        console.log("Il y a une query");
        this.searchMeal(params['mealName']);
      } else {
        console.log("Il y n'y a pas de query");
        this.getMealList();
      }
    */
    });



  }

  getMealList() {
    this.service.fetchMealsList().subscribe((rslt) => {
      this.mealList = rslt.meals;
      this.mealsSample = [];
      this.getMealSample();
    });
  }

  searchMeal(search?: string): void {
    this.service.fetchMealsListBy(search).subscribe((rslts) => {
      console.log("searchMeal");
      const rst = rslts.meals
      this.mealList = rst == null ? [] : rst;
      this.mealsSample = [];
      this.getMealSample();
    })
  }

  searchArea(name?: string): void {
    this.service.fetchAreaByName(name).subscribe((rslts) => {
      console.log("areaName");
      const rst = rslts.meals
      this.mealList = rst == null ? [] : rst;
      this.mealsSample = [];
      this.getMealSample();
    })
  }

  searchCategory(name?: string): void {
    this.service.fetchCategoryByName(name).subscribe((rslts) => {
      console.log("areaName");
      const rst = rslts.meals
      this.mealList = rst == null ? [] : rst;
      this.mealsSample = [];
      this.getMealSample();
    })
  }

  searchIDK(mealname: string, areaName: string, categoryName: string) {
  }

  async test() {
    return await lastValueFrom(this.service.fetchCategoryList());
  }

  getMealSample() {
    if (this.mealsSample.length != this.mealList.length) {
      console.log("jai attribué mes données");
      this.mealsSample = this.mealsSample.concat(this.mealList.slice(this.mealsSample.length, this.mealsSample.length + 10));
    } else {
      console.log("meals2 et mealList meme taille")
    }
  }

  /*  getAlbumData(fetchData: boolean) {
      if (fetchData) {
        this.service.fetchMeal(this.meals.length,this.meals.length+10).subscribe({
            next: (response) => {
              this.meals = this.meals.concat(response);
              console.log(this.meals);
            },
            error: (err) => {
              console.log(err);
            }
        }
        )
      }
    }*/

  openMealDetails(id: string): void {
    this.router.navigate(['details', id]);
  }

  getCommonElements(array1: any[], array2: any[]) {
    return array1.filter(element1 => array2.some(({strMeal,strMealThumb,idMeal}) => element1.idMeal === idMeal && element1.strMeal === strMeal && element1.strMealThumb===strMealThumb)).map(element => element.idMeal);
  }

  getCommonElements2(array1: string[], array2: string[]) {
    return array1.filter(element => array2.includes(element));
  }

  getCommonElements5(array1: any[], array2: any[]) {
    return array1.filter(element1 => array2.some(({idMeal}) => element1.idMeal === idMeal)).map(element => element.idMeal);
  }

  getCommonElements3(array1: any[], array2: any[]) {
    return array2.filter(object => array1.includes(object.idMeal));  }

  addCart(meal: Meal) {
    if (this.authService.isAuthenticated()){
      return this.authService.addCart(meal);
    }
    else {
      return this.router.navigateByUrl("/login");
    }
  }

  addFavorite(meal:Meal) {
    if (this.authService.isAuthenticated()) {
      this.authService.addFavorite(meal);
      this.favoriteList = this.getIdMeals(this.authService.authenticatedUser?.favorite ?? []);
    } else {
      this.router.navigateByUrl('/login');
    }
}

  getIdMeals(meals: Meal[]): string[] {
    return meals.map(meal => meal.idMeal);
  }

  removeFavorite(idMeal: string) {
    const index = this.favoriteList.indexOf(idMeal);
    this.authService.removeFavorite(index);
    this.favoriteList = this.getIdMeals(this.authService.authenticatedUser?.favorite ?? []);
  }

  isInFavoriteList(idMeal: string): boolean {
    return this.favoriteList.includes(idMeal ?? "");
  }

}
