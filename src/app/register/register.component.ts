import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../service/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(public authService: AuthenticationService, private router: Router) {
  }

  public errorMessage?: string;

  public registerFormGroup: FormGroup = new FormGroup(
    {
      email: new FormControl("", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl("", Validators.required),
    }
  );

  ngOnInit(): void {
  }

  public handleRegister() {
    let email = this.registerFormGroup.value.email;
    let password = this.registerFormGroup.value.password;
    this.authService.register(email, password).subscribe(
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
