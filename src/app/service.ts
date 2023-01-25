import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Test} from "./model/test";
import {lastValueFrom} from "rxjs";
@Injectable({
  providedIn: 'root',
})
export class Service {
  constructor(private http: HttpClient) {
  }
  public getConfig() {
    return this.http.get<Test>('toto');
  }
}
