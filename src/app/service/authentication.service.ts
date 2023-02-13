import {Injectable} from '@angular/core';
import {AppUser} from "../model/user";
import {Observable, of, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  users: AppUser[] = [];
  authenticatedUser: AppUser | undefined;

  constructor() {
    this.users = require('../data/mock-user.data.json');
    console.log(this.users);
  }

  public login(email: string, password: string): Observable<AppUser> {
    let appUser = this.users.find(value => value.email == email);
    if (!appUser) return throwError(() => new Error("User not found"));
    if (appUser.password != password) {
      return throwError(() => new Error("Bad credentials"));
    }
    return of(appUser);
  }

  public register(email: string, password: string): Observable<AppUser> {
    this.users.push({email: email, password: password, roles: ["USER"], cart: []});
    let appUser = {email: email, password: password, roles: ["USER"], cart: []};
    return of(appUser);
  }

  public authenticateUser(appUser: AppUser): Observable<boolean> {
    this.authenticatedUser = appUser;
    sessionStorage.setItem("authUser", JSON.stringify({email: appUser.email, roles: appUser.roles, jwt: "JWT_TOKEN", cart: appUser.cart}));
    return of(true);
  }

  public hasRole(role: string) : boolean {
    return this.authenticatedUser!.roles.includes(role);
  }

  public isAuthenticated() {
    if (sessionStorage.getItem("authUser")) {
      this.authenticatedUser = JSON.parse(sessionStorage.getItem("authUser")!) as AppUser;
    }
    return this.authenticatedUser!=undefined;
  }

  public logout(): Observable<boolean> {
    this.authenticatedUser=undefined;
    let currentAppUser:AppUser = JSON.parse(sessionStorage.getItem("authUser")!) as AppUser;

    this.users.map(obj => {
      if (obj.email === currentAppUser.email) {
        obj.cart = currentAppUser.cart;
      }
    });

    sessionStorage.removeItem("authUser");

    return of(true);
  }

  public test() {
    //    this.authenticatedUser = sessionStorage.getItem("authUser");
    let test = sessionStorage.getItem("authUser")
    typeof sessionStorage.getItem("authUser")
    let test2 = JSON.parse(test!) as AppUser;
    return test2;
  }


}
