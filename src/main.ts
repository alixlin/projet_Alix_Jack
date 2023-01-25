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
    this.passthrough();
    this.get('/toto', () => require('./app/data/mock-user.data.json'));
  }
})
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
