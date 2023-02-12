import { Component, OnInit } from '@angular/core';
import {Category} from "../model/Category";
import {Service} from "../../DataService/service";
import {Ingredient} from "../model/Ingredient";
import {Area} from "../model/Area";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged, lastValueFrom} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
interface FruitInterface {
  strIngredient: string;
  checked: boolean;
}
@Component({
  selector: 'app-side-filter',
  templateUrl: './side-filter.component.html',
  styleUrls: ['./side-filter.component.scss'],
})
export class SideFilterComponent implements OnInit {

  fruits: FruitInterface[] = [];
  form: FormGroup = new FormGroup({
    fruits: new FormArray([]),
  });
  result: {
    selectedFruit: FruitInterface[];
  } = { selectedFruit: [] };

  public categories:Category[] = [];
  public areas: Area[] = [];
  public ingredients:Ingredient[] = [];
  categoryForm: FormGroup = new FormGroup({
    category: new FormControl('allCategory'),
  });

  areaForm: FormGroup = new FormGroup({
    area: new FormControl('allArea'),
  })
  ingredientForm: FormGroup = new FormGroup( {
    item1: new FormControl(false),
  })

  constructor(private service: Service, private router: Router, private activatedRoute: ActivatedRoute,) {

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
          console.log("ACTIVEEE AREA");
          this.router.navigate(['home'],{queryParams: { area: v },queryParamsHandling: 'merge'});
        }
      );

    /*
    this.form.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe((v) =>
        {
          console.log(v);
          console.log("ACTIVEEE");
          const c = v.fruits.filter((f: FruitInterface) => f.checked) || [];
          let b:string[] = [];
          c.forEach(function (value: FruitInterface){
            b.push(value.name);
        })
          //this.router.navigate(['home'],{queryParams: { ingredient: b },queryParamsHandling: 'merge'});
        }
      );*/

  }

   async ngOnInit() {
    this.getCategoryList();
    this.getAreaList();
    this.getIngredientList();
    const b = await lastValueFrom(this.service.fetchIngredientsList());

    this.fruits = b;
    console.log(b);
    //this.getIngredientList();
    //const rslt = await lastValueFrom(this.service.fetchIngredientsList());
    //this.ingredients = rslt.meals;
    //for (const ingredient of this.ingredients) {
    //  this.ingredientForm.controls[ingredient.strIngredient] = new FormControl(false);
    //}


    // bind props with data from database
    // build reactive form skeleton
    // bind existing value to form control
    this._patchValues();
 /*   this.truc = this.form.controls?.['fruits'] as FormGroup
     console.log("truc")
     console.log(this.truc.controls)
     for (let i = 0;i<6;i++) {
       console.log()
     }
     const b = this.form.controls?.['fruits'] as FormGroup
     console.log(b.controls);
     // @ts-ignore
     console.log(this.form.controls?.['fruits']['controls']);
     // @ts-ignore
     console.log(this.form.controls.fruits.controls);
     console.log(this.form.controls?.['fruits']?.value.length);*/

     this.activatedRoute.queryParams.subscribe( (params: Params) => {
       console.log("///////////////////////////////////////////////////////");
       console.log("Side Filter Params");
       console.log(params);

       if (params['category']) this.categoryForm.get('category')?.setValue(params['category']);
       if (params['area']) this.areaForm.get('area')?.setValue(params['area']);
       if (params['ingredient'] && params['ingredient'].length > 0) {
         const formGroupArray = this.form.get('fruits') as FormGroup
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

     this.form.get('fruits')?.valueChanges
       .pipe(
         debounceTime(1000),
         distinctUntilChanged(),
       )
       .subscribe((v) =>
         {
           const c = v.filter((f: FruitInterface) => f.checked) || [];
           let b:string[] = [];
           c.forEach(function (value: FruitInterface){
             b.push(value.strIngredient);
           })
           console.log(v)
           this.router.navigate(['home'],{queryParams: { ingredient: b },queryParamsHandling: 'merge'});
         }
       );
  }

  getCategoryList() {
    this.service.fetchCategoryList().subscribe((rslt) => {
      this.categories = rslt;
    });
  }

  getAreaList(){
    this.service.fetchAreaList().subscribe((rslt) => {
      this.areas = rslt;
    });
  }

  getIngredientList(){
    this.service.fetchIngredientsList().subscribe((rslt) => {
      this.ingredients = rslt;
    });
  }

  initializeIngredientForm(){
    this.service.fetchIngredientsList().subscribe((rslt) => {
      this.ingredients = rslt.meals;
      for (const ingredient of this.ingredients) {
        this.ingredientForm.controls[ingredient.strIngredient] = new FormControl(false);
      }
    });
  }

  private _patchValues(): void {
    // get array control
    const formArray = this.form.get('fruits') as FormArray;
    // loop for each existing value
    console.log("Patch vlaues");
    console.log(this.fruits)
    this.fruits.forEach((fruit) => {
      // add new control to FormArray
      formArray.push(
        // here the new FormControl with item value from RADIO_LIST_FROM_DATABASE
        new FormGroup({
          strIngredient: new FormControl(fruit.strIngredient),
          checked: new FormControl(fruit.checked),
        })
      );
    });
  }

  submitForm(): void {
    const { value } = this.form;
    // get selected fruit from FormGroup value
    const selectedFruit =
      value?.fruits?.filter((f: FruitInterface) => f.checked) || [];
    // form value binded
    console.log('current form value: ', value);
    console.log('only selected form value: ', selectedFruit);
    // original value from database not change
    console.log('original fruits list: ', this.fruits);
    this.result = {
      selectedFruit,
    };
    let b:string[] = [];
    selectedFruit.forEach(function (value: FruitInterface){
      b.push(value.strIngredient);
      console.log(value.strIngredient)
    })
    this.router.navigate(['home'],{queryParams: { ingredient: b },queryParamsHandling: 'merge'});
  }

}
