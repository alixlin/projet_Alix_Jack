import { Component, OnInit } from '@angular/core';
import {Category} from "../model/Category";
import {Service} from "../../DataService/service";
import {Ingredient} from "../model/Ingredient";
import {Area} from "../model/Area";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged, lastValueFrom} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
@Component({
  selector: 'app-side-filter',
  templateUrl: './side-filter.component.html',
  styleUrls: ['./side-filter.component.scss'],
})
export class SideFilterComponent implements OnInit {

  public categories:Category[] = [];
  public areas: Area[] = [];
  public categoryForm: FormGroup = new FormGroup({
    category: new FormControl('allCategory'),
  });
  public areaForm: FormGroup = new FormGroup({
    area: new FormControl('allArea'),
  })
  ingredients: Ingredient[] = [];
  ingredientForm: FormGroup = new FormGroup({
    ingredients: new FormArray([]),
  });

  constructor(private service: Service, private router: Router, private activatedRoute: ActivatedRoute,) {

    this.categoryForm.get('category')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe((v) =>
        {
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
          this.router.navigate(['home'],{queryParams: { area: v },queryParamsHandling: 'merge'});
        }
      );
  }

   async ngOnInit() {
    this.getCategoryList();
    this.getAreaList();

    const b = await lastValueFrom(this.service.fetchIngredientsList());
    console.log(this.ingredientForm);
    this.ingredients = b;
    console.log(b);
    this._patchValues();

     this.activatedRoute.queryParams.subscribe( (params: Params) => {
       console.log("///////////////////////////////////////////////////////");
       console.log("Side Filter Params");
       console.log(params);

       if (params['category']) this.categoryForm.get('category')?.setValue(params['category']);
       if (params['area']) this.areaForm.get('area')?.setValue(params['area']);
       if (params['ingredient'] && params['ingredient'].length > 0) {
         const formGroupArray = this.ingredientForm.get('ingredients') as FormGroup
         console.log(formGroupArray.controls);
         let paramIngredient: string[] = [];
         typeof params['ingredient'] === 'string' ? paramIngredient[0]=params['ingredient'] : paramIngredient = params['ingredient'] as Array<string>;
         const a = formGroupArray.controls as unknown as any[];
         console.log(paramIngredient);
         for (let i = 0; i < paramIngredient.length; i++) {
           const c = a.filter(function (formGroup: FormGroup) {
               return formGroup.get('strIngredient')?.value == paramIngredient[i];
             }
           )
           c[0].get('checked').setValue(true)
         }
       }
       });

     this.ingredientForm.get('ingredients')?.valueChanges
       .pipe(
         debounceTime(1000),
         distinctUntilChanged(),
       )
       .subscribe((v) =>
         {
           const c = v.filter((f: Ingredient) => f.checked) || [];
           let b:string[] = [];
           c.forEach(function (value: Ingredient){
             b.push(value.strIngredient);
           })
           console.log(v)
           this.router.navigate(['home'],{queryParams: { ingredient: b },queryParamsHandling: 'merge'});
         }
       );
  }

  private getCategoryList() {
    this.service.fetchCategoryList().subscribe((rslt) => {
      this.categories = rslt;
    });
  }

  private getAreaList(){
    this.service.fetchAreaList().subscribe((rslt) => {
      this.areas = rslt;
    });
  }

  private _patchValues(): void {
    const formArray = this.ingredientForm.get('ingredients') as FormArray;
    console.log("Patch vlaues");
    console.log(this.ingredients)
    this.ingredients.forEach((ingredient) => {
      formArray.push(
        new FormGroup({
          strIngredient: new FormControl(ingredient.strIngredient),
          checked: new FormControl(ingredient.checked),
        })
      );
    });
  }
}
