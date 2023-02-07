import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {Service} from "../../DataService/service";
import {
  filter,
  fromEvent,
  map,
  of, Subscription,
  switchMap
} from "rxjs";
import {Meal} from "../model/Meal";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  private subscription?: Subscription;
  public mealsSample: Meal[] = [];
  private mealList: Meal[] = [];

  constructor(private el: ElementRef,
              private service: Service,
              private activatedRoute: ActivatedRoute,
              private router: Router,
  ) {
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit() {
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
    this.service.fetchMealsList().subscribe((rslt) => {
      console.log("getMealList");
      this.mealList = rslt;
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
}
