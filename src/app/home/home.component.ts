import {Component, HostListener, OnInit} from '@angular/core';
import {Test} from "../model/test";
import {Service} from "../../DataService/service";
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  lastValueFrom, map,
  Observable,
  of,
  pairwise,
  startWith,
  switchMap
} from "rxjs";
import {FormControl} from "@angular/forms";
import {Meal} from "../model/Meal";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public meals: Meal[] = [];
  public testmeal: Meal[] = [];
  searchControl = new FormControl();

  constructor(private service: Service) {
  }

  async ngOnInit() {
    window.scroll(0, 0);
    this.testmeal = await lastValueFrom(this.service.fetchMealsList());
    this.getAlbumData(true);
    console.log(this.testmeal);
    //this.meals = await lastValueFrom(this.service.fetchMealsList());
    //console.log(await lastValueFrom(this.service.fetchMeal(0,10)))


  }

  getAlbumData(fetchData: boolean) {
    if (fetchData) {
      console.log(this.testmeal);
      console.log(this.testmeal.slice(this.meals.length, this.meals.length + 10));
      this.meals = this.meals.concat(this.testmeal.slice(this.meals.length, this.meals.length + 10));
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


}
