import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataServiceService } from '../service/dataService.service';
import { Person } from '../model/person';


@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss']
})
export class GestionComponent implements OnInit {

  constructor(private router: Router,private dataService: DataServiceService) { }

  public person?:Person;

  ngOnInit(){
   this.dataService.contactForm == undefined ? this.router.navigate(['/404']) : this.person = this.dataService.contactForm;

  }

}
