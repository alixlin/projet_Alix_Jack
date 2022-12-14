import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.scss']
})
export class ListeComponent implements OnInit {

  map = new Map<String, String>();

  constructor(){
    this.map.set("Avatar","https://fr.web.img2.acsta.net/c_310_420/pictures/22/08/25/09/04/2146702.jpg");
    this.map.set("Avengers: Endgame","https://fr.web.img6.acsta.net/c_310_420/pictures/19/04/04/09/04/0472053.jpg");
    this.map.set("Titanic","https://fr.web.img6.acsta.net/c_310_420/pictures/19/10/25/11/18/5224976.jpg");
    this.map.set("Star Wars, épisode VII : Le Réveil de la Force","https://fr.web.img2.acsta.net/c_310_420/pictures/15/10/18/18/56/052074.jpg");
    this.map.set("Avengers: Infinity War","https://fr.web.img3.acsta.net/c_310_420/pictures/18/03/16/14/42/0611719.jpg");
  }

  ngOnInit(): void {
  }

}
