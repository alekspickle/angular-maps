import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
 public currentUser: Object;
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
  register(user) {
    return this.http.post(`${config.url}/auth/register`, user);
  }
  logout() {
    this.currentUser = null;
    this.isAuthorized = false;
    this.router.navigate(['/login'])
    localStorage.removeItem("currentUser");
  }
  getUsers() {
    return this.http.get(`${config.url}/all`);
  }
  updateUser(user) {
    return this.http.get(`${config.url}/${user}`);
  }
  

  _setIsLogged(result): Observable<Object> {
    if(result.login) this.router.navigate(['/map'])
    return (this.isAuthorized = result.login);
  }
  _setCurrentUser(result): Observable<Object> {
    return (this.currentUser = result.user);
  }
}
