import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import { DataServiceService } from '../dataService.service';

export class Person {
  firstName: string;
  lastName: string;
  email?: string;
  age?: string;
  comment: string;

  constructor(firstName: string, lastName: string,comment: string, email?: string, age?: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.age = age;
    this.comment = comment;
  }
}

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  
  contactForm = new FormGroup({
    firstName: new FormControl('',Validators.required),
    lastName: new FormControl('',Validators.required),
    age: new FormControl(''),
    ishideEmail: new FormControl(true),
    email: new FormControl('',[Validators.email,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    comment: new FormControl('',Validators.required)
  });

  getFirstName(){
    return this.contactForm.get('firstName')?.value!
  }

  getLastName(){
    return this.contactForm.get('lastName')?.value!
  }

  getAge(){
    return this.contactForm.get('age')?.value ?? undefined
  }

  getMail(){
    return this.contactForm.get('email')?.value ?? undefined
  }

  getComment(){
    return this.contactForm.get('comment')?.value!
  }

  checkboxRequired() {
    if (this.contactForm.get('ishideEmail')?.value) {
      this.contactForm.get('email')?.clearValidators();
    } else {
      this.contactForm.get('email')?.setValidators(Validators.required);
    }
    this.contactForm.get('email')?.updateValueAndValidity();
  }

  constructor(private router: Router,private dataService: DataServiceService) {
   }

  onSubmit() : void {
    alert('Le formulaire est valide');
    const person: Person = new Person(this.getFirstName(),this.getLastName(),this.getComment(),this.getMail(),this.getAge());
    this.dataService.contactForm = person;
    this.router.navigate(['/home'])
  }

  ngOnInit(): void {
  }

}
