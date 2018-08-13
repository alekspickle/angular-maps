import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RegisterService } from "./register.service";
import { Headers } from "@angular/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

const config = {
  url: "http://localhost:3001"
  // url: "https://maps-test.herokuapp.com"
};

@Injectable({
  providedIn: "root"
})
export class UserService {
  currentUser: Object;
  isAuthorized: boolean = false;

  constructor(public http: HttpClient, public router: Router) {}

  private getHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    headers.append("Authorization", "Bearer");
    return headers;
  }

  login(email: string, password: string){
    return this.http
      .post(`${config.url}/auth/login`, {
        email: email,
        password: password
      })
      .subscribe(result => {
        console.log('login result',result)
        this._setIsLogged(result);
        this._setCurrentUser(result)
      });
  }
  register(user: RegisterService) {
    return this.http.post(`${config.url}/auth/register`, user);
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
  }
  getUsers() {
    return this.http.get(`${config.url}/all`);
  }
  updateUser(user: RegisterService) {
    return this.http.get(`${config.url}/${user}`);
  }
  getUserLocations(userId: number) {
    return this.http.get(`${config.url}/location/${userId}`);
  }

  createLocation(location: any) {
    return this.http.post(`${config.url}/location/create`, location);
  }

  _setIsLogged(result): Observable<Object> {
    if(result.login) this.router.navigate(['/map'])
    return (this.isAuthorized = result.login);
  }
  _setCurrentUser(result): Observable<Object> {
    return (this.currentUser = result.user);
  }
}
