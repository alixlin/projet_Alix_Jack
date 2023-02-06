import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {Test} from "../model/test";
import {Service} from "../../DataService/service";
import {
  debounceTime,
  distinctUntilChanged, filter,
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
import {ActivatedRoute, Params, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public meals2: Meal[] = [];
  private testmeal: Meal[] = [];
  searchControl = new FormControl();

  constructor(private el: ElementRef, private service: Service, private activatedRoute: ActivatedRoute, private http: HttpClient, private router: Router,) {
  }

  ngOnInit() {
    const divElement = this.el.nativeElement.querySelector('#myDiv');
    const scroll$ = fromEvent(window, 'scroll');
    scroll$.pipe(
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
    ).subscribe(() => this.getAlbumData(true));

    //window.scroll(0, 0);
    //this.testmeal = await lastValueFrom(this.service.fetchMealsList());
    /*    this.service.fetchMealsList().subscribe((mealsList) => {
          this.meals = mealsList;
        })*/
    //this.getAlbumData(true);

    //this.meals = await lastValueFrom(this.service.fetchMealsList());
    //console.log(await lastValueFrom(this.service.fetchMeal(0,10)))

    // Search bar

    // 1ere version avec une url type http://localhost:4200/home/search/salad
    /*
    this.activatedRoute.params.subscribe((params: Params) => {
      console.log("params");
      console.log(params);
      if (params['mealName'] && params['mealName'].trim().length > 0) {
        console.log("Il y a une query");
        this.searchMeal(params['mealName']);
      } else {
        console.log("Il y n'y a pas de query");
        this.getMealList();
      }
    });
    */
    // 2eme version avec une url type http://localhost:4200/home?mealName=salad
    //const filter2 = this.activatedRoute.snapshot.queryParamMap.get('mealName');
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log("params");
      console.log(params);
      if (params['mealName'] && params['mealName'].trim().length > 0) {
        console.log("Il y a une query");
        this.searchMeal(params['mealName']);
      } else {
        console.log("Il y n'y a pas de query");
        this.getMealList();
      }
    });

  }

  getMealList() {
    this.service.fetchMealsList().subscribe((mealsList) => {
      this.testmeal = mealsList;
      this.meals2 = [];
      console.log(this.testmeal);
      console.log(typeof this.testmeal);
      console.log(this.testmeal instanceof Array<Meal>);
      console.log(typeof this.testmeal[0] === "object" && this.testmeal[0].hasOwnProperty("idMeal") && typeof this.testmeal[0].idMeal === "string");
      console.log(this.testmeal[0] instanceof Meal);
      this.getAlbumData(true);
    });
  }

  searchMeal(search?: string): void {
    this.service.fetchMealsListBy(search).subscribe((rslts) => {
      const rst = rslts.meals
      this.testmeal = rst == null ? [] : rst;
      this.meals2 = [];
      console.log("SearchMeal");
      console.log(rst);
      console.log(this.testmeal);
      console.log(this.meals2);
      this.getAlbumData(true);
    })
  }

  getAlbumData(fetchData: boolean) {
    if (fetchData) {
      this.meals2 = this.meals2.concat(this.testmeal.slice(this.meals2.length, this.meals2.length + 10));
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
}
