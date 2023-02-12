import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Test} from "../app/model/test";
import {lastValueFrom, map} from "rxjs";
import {Meal} from "../app/model/Meal";
import {AppUser} from "../app/model/user";

@Injectable({
  providedIn: 'root',
})
export class Service {
  constructor(private http: HttpClient) {
  }

  /*  public getConfig() {
      return this.http.get<Test>('/toto');
    }*/
  public getConfig() {
    return this.http.get<Test>('/toto').pipe(
      map(
        data => {
          return new Test(data['id'], data['nom'], data['prenom']);
        }
      )
    );
  }

  public getUsersList() {
    return this.http.get<AppUser[]>('/usersList');
  }

  public fetchMealsList() {
    return this.http.get<any>('/mealsList');
  }

  fetchMeal(start: number, end: number) {
    let params = new HttpParams();
    return this.http.get<any>('/mealsList/' + start.toString() + "/" + end.toString());
  }

  public fetchMealsListBy(search?: string) {
    return this.http.get<any>('https://www.themealdb.com/api/json/v1/1/search.php?s=' + search);
  }

  public fetchCategoryList(){
    return this.http.get<any>('/categoryList');
  }

  public fetchAreaList(){
    return this.http.get<any>('/areaList');
  }

  public fetchIngredientsList(){
    return this.http.get<any>('/ingredientList');
  }

  public fetchMealById(id?:string){
    return this.http.get<any>('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);
  }

  public fetchAreaByName(name?:string) {
    return this.http.get<any>('https://www.themealdb.com/api/json/v1/1/filter.php?a=' + name);
  }

  public fetchCategoryByName(name?:string) {
    return this.http.get<any>('https://www.themealdb.com/api/json/v1/1/filter.php?c=' + name);
  }

  public fetchIngredientByName(name?:string) {
    return this.http.get<any>('https://www.themealdb.com/api/json/v1/1/filter.php?i=' + name);
  }

  public async test(name?:string) {
    return this.http.get<any>('https://www.themealdb.com/api/json/v1/1/filter.php?c=' + name);
  }
}
