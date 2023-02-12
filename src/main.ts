import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {Server} from "miragejs";

if (environment.production) {
  enableProdMode();
}

new Server({
  routes() {

    this.get('/toto', () => require('./app/data/mock-user.data.json'));
    this.get('/usersList', () => require('./app/data/mock-user.data.json'));
    this.get('/mealsList/:start/:end', (schema,request) => {
      let start = request.params['start']
      let end = request.params['end']
      return require('./app/data/mock-mealsList.json').meals.slice(start,end);
    }, { timing: 400 });
    this.get('/mealsList', () => require('./app/data/mock-mealsList.json'));
    this.get('/categoryList', () => require('./app/data/categoryList.json').meals);
    this.get('/areaList', () => require('./app/data/areaList.json').meals);
    this.get('/ingredientList', () => require('./app/data/ingredientList.json').meals);
    this.urlPrefix = 'https://www.themealdb.com/api/json/v1/1';
    this.passthrough();
  }
})
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
