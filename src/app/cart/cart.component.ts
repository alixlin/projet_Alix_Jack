import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";

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

  public isMenuOpen:Boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
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

}
