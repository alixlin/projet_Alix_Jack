import {Component, OnInit} from '@angular/core';
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

  constructor(private service: Service, private router: Router, private activatedRoute: ActivatedRoute,) {
  }

  public categories: Category[] = [];
  public areas: Area[] = [];
  public categoryForm: FormGroup = new FormGroup({
    category: new FormControl('allCategory'),
  });
  public areaForm: FormGroup = new FormGroup({
    area: new FormControl('allArea'),
  })
  public ingredients: Ingredient[] = [];
  public ingredientForm: FormGroup = new FormGroup({
    ingredients: new FormArray([]),
  });

  async ngOnInit() {
    this.getCategoryList();
    this.getAreaList();
    this.watchCategoryForm();
    this.watchAreaForm();
    this.ingredients = await lastValueFrom(this.service.fetchIngredientsList());
    this.bindValues();
    this.watchIngredientForm();

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params['category']) this.categoryForm.get('category')?.setValue(params['category']);
      if (params['area']) this.areaForm.get('area')?.setValue(params['area']);
      if (params['ingredient'] && params['ingredient'].length > 0) {
        this.updateIngredientFromGroup(params['ingredient']);
      }
    });
  }

  private getCategoryList() {
    this.service.fetchCategoryList().subscribe((rslt) => {
      this.categories = rslt;
    });
  }

  private getAreaList() {
    this.service.fetchAreaList().subscribe((rslt) => {
      this.areas = rslt;
    });
  }

  private bindValues(): void {
    const formArray = this.ingredientForm.get('ingredients') as FormArray;
    this.ingredients.forEach((ingredient) => {
      formArray.push(
        new FormGroup({
          strIngredient: new FormControl(ingredient.strIngredient),
          checked: new FormControl(ingredient.checked),
        })
      );
    });
  }

  private watchCategoryForm() {
    this.categoryForm.get('category')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe((v) => {
          this.router.navigate(['home'], {queryParams: {category: v}, queryParamsHandling: 'merge'});
        }
      );
  }

  private watchAreaForm() {
    this.areaForm.get('area')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe((v) => {
          this.router.navigate(['home'], {queryParams: {area: v}, queryParamsHandling: 'merge'});
        }
      );
  }

  private watchIngredientForm() {
    this.ingredientForm.get('ingredients')?.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe((ingredientArray: Ingredient[]) => {
          const checkedIngredient: Ingredient[] = ingredientArray.filter((f: Ingredient) => f.checked) || [];
          let checkedIngredientName: string[] = [];
          checkedIngredient.forEach(function (value: Ingredient) {
            checkedIngredientName.push(value.strIngredient);
          })
          this.router.navigate(['home'], {
            queryParams: {ingredient: checkedIngredientName},
            queryParamsHandling: 'merge'
          });
        }
      );
  }

  private updateIngredientFromGroup(param: any) {
    const formGroupArray = this.ingredientForm.get('ingredients') as FormGroup
    let ingredientName: string[] = [];
    typeof param === 'string' ? ingredientName[0] = param : ingredientName = param as Array<string>;
    const ingredientFormGroupArray = formGroupArray.controls as unknown as any[];
    for (let i = 0; i < ingredientName.length; i++) {
      const ingredientFormGroup = ingredientFormGroupArray.filter(function (formGroup: FormGroup) {
          return formGroup.get('strIngredient')?.value == ingredientName[i];
        }
      )
      ingredientFormGroup[0].get('checked').setValue(true);
    }
  }
}
