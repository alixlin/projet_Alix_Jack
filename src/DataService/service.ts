import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AppUser} from "../app/model/user";
import {MealResponse} from "../app/model/mealResponse";
import { queryResponse} from "../app/model/queryResponse";
import {Category} from "../app/model/Category";
import {Area} from "../app/model/Area";
import {Ingredient} from "../app/model/Ingredient";

@Injectable({
  providedIn: 'root',
})
export class Service {
  constructor(private http: HttpClient) {
  }

  public getUsersList() {
    return this.http.get<AppUser[]>('/usersList');
  }

  public fetchMealsList() {
    return this.http.get<MealResponse>('/mealsList');
  }

  public fetchMealsListBy(search?: string) {
    return this.http.get<queryResponse>('https://www.themealdb.com/api/json/v1/1/search.php?s=' + search);
  }

  public fetchCategoryList(){
    return this.http.get<Category[]>('/categoryList');
  }

  public fetchAreaList(){
    return this.http.get<Area[]>('/areaList');
  }

  public fetchIngredientsList(){
    return this.http.get<Ingredient[]>('/ingredientList');
  }

  public fetchMealById(id?:string){
    return this.http.get<MealResponse>('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);
  }

  public fetchAreaByName(name?:string) {
    return this.http.get<queryResponse>('https://www.themealdb.com/api/json/v1/1/filter.php?a=' + name);
  }

  public fetchCategoryByName(name?:string) {
    return this.http.get<queryResponse>('https://www.themealdb.com/api/json/v1/1/filter.php?c=' + name);
  }

  public fetchIngredientByName(name?:string) {
    return this.http.get<queryResponse>('https://www.themealdb.com/api/json/v1/1/filter.php?i=' + name);
  }

}
