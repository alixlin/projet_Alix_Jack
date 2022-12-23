import { Injectable } from '@angular/core';
import { Person } from './person';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  public contactForm?: Person;

  constructor() { }
}
