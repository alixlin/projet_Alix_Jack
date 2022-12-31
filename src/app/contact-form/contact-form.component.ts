import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import { Person } from '../model/person';
import { DataServiceService } from '../service/dataService.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  constructor(private router: Router,private dataService: DataServiceService) {}

  public contactForm = new FormGroup({
    firstName: new FormControl(undefined,Validators.required),
    lastName: new FormControl(undefined,Validators.required),
    age: new FormControl(undefined),
    ishideEmail: new FormControl(false),
    email: new FormControl(undefined,[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    comment: new FormControl(undefined,Validators.required)
  });

  ngOnInit(): void {
  }

  public checkboxRequired() {
    this.contactForm.get('ishideEmail')?.value ? this.contactForm.get('email')?.clearValidators() : this.contactForm.get('email')?.setValidators([Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]);
    this.contactForm.get('email')?.updateValueAndValidity();
  }

  public onSubmit() : void {
    alert('Le formulaire est valide');
    const person = new Person();
    person.firstName = this.contactForm.value.firstName!;
    person.lastName = this.contactForm.value.lastName!;
    person.comment = this.contactForm.value.comment!;
    person.email = this.contactForm.get('ishideEmail')?.value ? this.contactForm.value.email = undefined : this.contactForm.value.email!;
    person.age = this.contactForm.value.age ?? undefined
    this.dataService.contactForm = person;
    this.router.navigate(['/home'])
  }

}
