import {
  Component,
  ElementRef,
  OnInit, Renderer2,
  ViewChild,
} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Service} from "../../DataService/service";
import {Meal} from "../model/Meal";
import {trigger, style, animate, transition} from '@angular/animations';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  animations: [
    trigger('enterLeaveTrigger', [
      transition(':enter', [
        style({transform: "translateX(100%)"}),
        animate('500ms ease-in', style({transform: "translateX(0)"})),
      ]),
      transition(':leave', [
        style({transform: "translateX(0)"}),
        animate('500ms ease-out', style({transform: "translateX(100%)"}))
      ])
    ]),
    trigger('enterLeaveBackground', [
      transition(':enter', [
        style({opacity: "0"}),
        animate('500ms ease-in', style({opacity: "1"})),
      ]),
      transition(':leave', [
        style({opacity: "1"}),
        animate('500ms ease-out', style({opacity: "0"}))
      ])
    ])
  ]
})
export class DetailsComponent implements OnInit {

  @ViewChild('toggleButton') toggleButton?: ElementRef;
  @ViewChild('menu') menu?: ElementRef;

  public isMenuOpen:Boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  meal?: Meal;
  showSidebar = false;
  ingredientsAndMeasures: any[] = [];

  constructor(private activatedRoute: ActivatedRoute, private service: Service, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.getMealDetails(params['id']);
    });

    this.renderer.listen('window', 'click', (e: Event) => {
      console.log(this.menu?.nativeElement);
      if (
        e.target !== this.toggleButton?.nativeElement &&
        !this.menu?.nativeElement.contains(e.target)
      ) {
        this.isMenuOpen = false;
      }
    });
  }

  getMealDetails(id: string) {
    this.service.fetchMealById(id).subscribe((rslt) => {
      this.meal = rslt.meals[0];
      for (let i = 0; i < 20; i++) {
        const count = i + 1
        const ingredient = "strIngredient" + count.toString();
        const measure = "strMeasure" + count.toString();
        this.ingredientsAndMeasures[i] = [rslt.meals[0][ingredient], rslt.meals[0][measure]];
      }
      console.log(this.meal);
    });
  }

}
