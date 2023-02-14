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
export class SearchBarComponent implements OnInit {
  public searchForm: FormGroup = new FormGroup({
    search: new FormControl(''),
  })

  constructor(private service: Service, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.searchForm.get('search')?.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe((v) => {
          this.router.navigate(['home'], {queryParams: {mealName: v}, queryParamsHandling: 'merge'});
        }
      );

    this.route.queryParams.subscribe((params: Params) => {
      if (params['mealName']) this.searchForm.get('search')?.setValue(params['mealName']);
    });
  }
}
