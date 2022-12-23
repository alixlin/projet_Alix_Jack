import { Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  public contactForm?: Person;

  constructor() { }
}
