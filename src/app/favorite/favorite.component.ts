import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../service/authentication.service";
import {Router} from "@angular/router";
import {Meal} from "../model/Meal";
import {AppUser} from "../model/user";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  public favoriteList: Meal[] = [];

  constructor(private authService: AuthenticationService, private router: Router) {
  }

  ngOnInit(): void {
    !this.authService.isAuthenticated() ? this.router.navigate(['/home']) : this.favoriteList = this.authService.authenticatedUser!.favorite;
  }

  removeFavorite(index: number) {
    this.favoriteList.splice(index, 1);
    this.authService.removeFavorite(index);
  }

}
