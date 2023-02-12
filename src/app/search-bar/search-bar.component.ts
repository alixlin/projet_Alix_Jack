import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs";
import {Service} from "../../DataService/service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit{

  searchForm: FormGroup = new FormGroup({
    search: new FormControl(''),
  })

  public usersList: Array<any> = [];

  constructor(private service: Service, private router: Router, private route: ActivatedRoute) {
    // Pas sure de garder ca
    /*    this.route.paramMap.subscribe(params => {
          if (this.searchForm.get('search')?.value =="" && params.get('mealName')?.length != 0)
            this.searchForm.get('search')?.setValue(params.get('mealName'));
        });*/

    this.searchForm.get('search')?.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe((v) =>
        {
          this.router.navigate(['home'],{queryParams: { mealName: v }, queryParamsHandling: 'merge'});
        }
      )
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      console.log("////////////////////////////////////")
      console.log("SEARCH BAR");
      console.log(params)
      if (params['mealName']) this.searchForm.get('search')?.setValue(params['mealName']);
    });
  }
}
