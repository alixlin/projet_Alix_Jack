import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {AuthenticationService} from "../service/authentication.service";
import {Router} from "@angular/router";
import {Meal} from "../model/Meal";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
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
export class CartComponent implements OnInit {

  @ViewChild('toggleButton') toggleButton?: ElementRef;
  @ViewChild('menu') menu?: ElementRef;

  constructor(private renderer: Renderer2, private authService: AuthenticationService, private router: Router) {
  }

  public shoppingCart: Meal[] = [];
  public isMenuOpen: Boolean = false;
  public price: number = 0;
  private countTest: number = 0;


  ngOnInit(): void {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (
        !this.toggleButton?.nativeElement.contains(e.target) &&
        !this.menu?.nativeElement.contains(e.target) && this.isMenuOpen && this.countTest == 0
      ) {
        this.isMenuOpen = false;
      } else {
        this.countTest = 0;
      }
    });
  }

  public toggleMenu() {
    if (this.authService.isAuthenticated()) {
      this.shoppingCart = this.authService.authenticatedUser!.cart;
      this.price = this.computePrice(this.shoppingCart.length);
      this.isMenuOpen = !this.isMenuOpen;
    } else this.router.navigateByUrl("/login");
  }

  public removeCart(index: number) {
    this.shoppingCart.splice(index, 1);
    this.countTest = 1;
    this.price = this.computePrice(this.shoppingCart.length);
    this.authService.removeCart(index);
  }

  private computePrice(nbMeal: number): number {
    let unitCost: number = 5;
    let price: number;
    let numberOfDiscounts:number = Math.floor(nbMeal / 10);
    numberOfDiscounts = Math.min(numberOfDiscounts, 3);
    unitCost -= 0.5 * numberOfDiscounts;
    price = nbMeal * unitCost;
    return price;
  }

}
