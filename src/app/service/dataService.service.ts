import { Injectable } from '@angular/core';
import { Person } from '../model/person';



@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor() { }

  public contactForm?: Person;
}
