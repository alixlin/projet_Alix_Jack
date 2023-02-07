import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Test} from "../app/model/test";
import {lastValueFrom, map} from "rxjs";
import {Meal} from "../app/model/Meal";

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
    return this.http.get<any>('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
  }

  public fetchAreaList(){
    return this.http.get<any>('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
  }

  public fetchIngredientsList(){
    return this.http.get<any>('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
  }

  public fetchMealById(id?:string){
    return this.http.get<any>('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);
  }
}