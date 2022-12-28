import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataServiceService } from '../dataService.service';
import { Person } from '../person';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss']
})
export class GestionComponent implements OnInit {
  person?:Person;

  constructor(private router: Router,private dataService: DataServiceService) { }

  ngOnInit(){
    if (this.dataService.contactForm == undefined) {
      this.router.navigate(['/404'])
   }
    
   this.person = this.dataService.contactForm;

  }

}
