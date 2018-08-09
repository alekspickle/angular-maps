import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
  public isAuthenticated: boolean = false;

  constructor(public http: HttpClient) {}

  login(username: string, password: string) {
    return this.http
      .post(`${config.url}/auth/login`, {
        username: username,
        password: password
      })
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user) {
            this.setIsAuth()
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user));
          }

          return user;
        })
      );
  }
  createUser(user) {
    return this.http.post(`${config.url}/auth/register`, user);
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
  }
  getUsers() {
    return this.http.get(`${config.url}/all`);
  }
  getUser(cred) {
    return this.http.get(`${config.url}/${cred}`);
  }
  getUserLocations(userId) {
    return this.http.get(`${config.url}/location/${userId}`);
  }
  
  createLocation(location) {
    return this.http.post(`${config.url}/location/create`, location);
  }
  setIsAuth() {
    this.isAuthenticated = true;
  }
}
