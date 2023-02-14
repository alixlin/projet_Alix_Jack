import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../service/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public errorMessage: any;

  public userFormGroup: FormGroup = new FormGroup(
    {
      email: new FormControl("", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl("", Validators.required)
    }
  );


  constructor(public authService: AuthenticationService, private router: Router) {
  }

  ngOnInit(): void {
  }

  handleLogin() {
    let email = this.userFormGroup.value.email;
    let password = this.userFormGroup.value.password;
    this.authService.login(email, password).subscribe(
      {
        next: (appUser) => {
          this.authService.authenticateUser(appUser).subscribe(
            {
              next: (data) => {
                this.router.navigateByUrl("/home");
              }
            }
          )
        },
        error: (err) => {
          this.errorMessage = err;
        }
      }
    )
  }
}
