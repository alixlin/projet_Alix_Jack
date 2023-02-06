import { Component, OnInit } from '@angular/core';
import {Category} from "../model/Category";
import {Service} from "../../DataService/service";
import {Ingredient} from "../model/Ingredient";
import {Area} from "../model/Area";
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime, distinctUntilChanged, lastValueFrom} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-side-filter',
  templateUrl: './side-filter.component.html',
  styleUrls: ['./side-filter.component.scss']
})
export class SideFilterComponent implements OnInit {

  public categories:Category[] = [];
  public areas: Area[] = [];
  public ingredients:Ingredient[] = [];
  checkboxItems = ['item1', 'item2', 'item3'];
  categoryForm: FormGroup = new FormGroup({
    category: new FormControl('allCategory'),
  });

  areaForm: FormGroup = new FormGroup({
    area: new FormControl('allArea'),
  })
  ingredientForm: FormGroup = new FormGroup( {
    item1: new FormControl(false),
  })

  constructor(private service: Service, private router: Router) {

    this.categoryForm.get('category')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe((v) =>
        {
          console.log(v);
          this.router.navigate(['home'],{queryParams: { category: v },queryParamsHandling: 'merge'});
        }
      );

    this.areaForm.get('area')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe((v) =>
        {
          console.log(v);
          this.router.navigate(['home'],{queryParams: { area: v },queryParamsHandling: 'merge'});
        }
      );

    this.ingredientForm.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe((v) =>
        {
          console.log(v);
          //this.router.navigate(['home'],{queryParams: { area: v },queryParamsHandling: 'merge'});
        }
      );

  }

  async ngOnInit() {
    this.getCategoryList();
    this.getAreaList();
    const rslt = await lastValueFrom(this.service.fetchIngredientsList());
    this.ingredients = rslt.meals;
    for (const ingredient of this.ingredients) {
      this.ingredientForm.controls[ingredient.strIngredient] = new FormControl(false);
    }
    console.log(this.ingredientForm);


    //this.initializeIngredientForm();
  }

  getCategoryList() {
    this.service.fetchCategoryList().subscribe((rslt) => {
      this.categories = rslt.meals;
    });
  }

  getAreaList(){
    this.service.fetchAreaList().subscribe((rslt) => {
      this.areas = rslt.meals;
    });
  }

  async getIngredientList(){
    /*this.service.fetchIngredientsList().subscribe((rslt) => {
      this.ingredients = rslt.meals;
    });*/

    const rslt = await lastValueFrom(this.service.fetchIngredientsList());
    this.ingredients = rslt.meals;
  }

  initializeIngredientForm(){
    this.service.fetchIngredientsList().subscribe((rslt) => {
      this.ingredients = rslt.meals;
      for (const ingredient of this.ingredients) {
        this.ingredientForm.controls[ingredient.strIngredient] = new FormControl(false);
      }
    });
  }

}
