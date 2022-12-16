import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  contactForm = new FormGroup({
    firstName: new FormControl(' '),
    lastName: new FormControl(' '),
    age: new FormControl(' '),
    hideEmail: new FormControl(false),
    email: new FormControl(' '),
    comment: new FormControl(' ')
  })



  constructor() { }

  onSubmit() : void {
    alert('Le formulaire est valide');
    window.location.href = '/';
  }

  ngOnInit(): void {
  }

}
