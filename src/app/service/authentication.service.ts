import {Injectable} from '@angular/core';
import {AppUser} from "../model/user";
import {Observable, of, throwError} from "rxjs";
import {Meal} from "../model/Meal";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() {
    this.users = require('../data/mock-user.data.json');
  }

  public authenticatedUser: AppUser | undefined;

  private users: AppUser[] = [];

  public login(email: string, password: string): Observable<AppUser> {
    let appUser = this.users.find(value => value.email == email);
    if (!appUser) return throwError(() => new Error("Incorrect user or password"));
    if (appUser.password != password) {
      return throwError(() => new Error("Incorrect user or password"));
    }
    return of(appUser);
  }

  public register(email: string, password: string): Observable<AppUser> {
    let isUser = this.users.find(value => value.email == email);
    if (isUser) return throwError(() => new Error("User already exist"));
    this.users.push({email: email, password: password, roles: ["USER"], cart: [], favorite: []});
    let appUser = {email: email, password: password, roles: ["USER"], cart: [], favorite: []};
    return of(appUser);
  }

  public authenticateUser(appUser: AppUser): Observable<boolean> {
    this.authenticatedUser = appUser;
    sessionStorage.setItem("authUser", JSON.stringify({
      email: appUser.email,
      roles: appUser.roles,
      jwt: "JWT_TOKEN",
      cart: appUser.cart,
      favorite: appUser.favorite
    }));
    return of(true);
  }

  public isAuthenticated() {
    if (sessionStorage.getItem("authUser")) {
      this.authenticatedUser = JSON.parse(sessionStorage.getItem("authUser")!) as AppUser;
    }
    return this.authenticatedUser != undefined;
  }

  public logout(): Observable<boolean> {
    this.users.map(obj => {
      if (obj.email === this.authenticatedUser?.email) {
        obj.cart = this.authenticatedUser.cart;
        obj.favorite = this.authenticatedUser.favorite;
      }
    });
    this.authenticatedUser = undefined;
    sessionStorage.removeItem("authUser");
    return of(true);
  }


  /////////////////////////////////////////////////////////////////////////
  /// Favorite ///
  /////////////////////////////////////////////////////////////////////////

  public removeFavorite(index: number) {
    this.authenticatedUser?.favorite.splice(index, 1);
    sessionStorage.setItem("authUser", JSON.stringify({
      email: this.authenticatedUser?.email,
      roles: this.authenticatedUser?.roles,
      jwt: "JWT_TOKEN",
      cart: this.authenticatedUser?.cart,
      favorite: this.authenticatedUser?.favorite
    }));
  }

  public addFavorite(meal: Meal) {
    this.authenticatedUser?.favorite.push(meal);
    return sessionStorage.setItem("authUser", JSON.stringify({
      email: this.authenticatedUser?.email,
      roles: this.authenticatedUser?.roles,
      jwt: "JWT_TOKEN",
      cart: this.authenticatedUser?.cart,
      favorite: this.authenticatedUser?.favorite
    }));
  }

  /////////////////////////////////////////////////////////////////////////
  /// Cart ///
  /////////////////////////////////////////////////////////////////////////

  public removeCart(index: number) {
    this.authenticatedUser?.cart.splice(index, 1);
    sessionStorage.setItem("authUser", JSON.stringify({
      email: this.authenticatedUser?.email,
      roles: this.authenticatedUser?.roles,
      jwt: "JWT_TOKEN",
      cart: this.authenticatedUser?.cart,
      favorite: this.authenticatedUser?.favorite
    }));
  }

  public addCart(meal: Meal) {
    this.authenticatedUser?.cart.push(meal);
    return sessionStorage.setItem("authUser", JSON.stringify({
      email: this.authenticatedUser?.email,
      roles: this.authenticatedUser?.roles,
      jwt: "JWT_TOKEN",
      cart: this.authenticatedUser?.cart,
      favorite: this.authenticatedUser?.favorite
    }));
  }

}
