import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

const config = {
  url: "https://localhost:3001"
};

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(public http: HttpClient) {}

  // public isAuthenticated: boolean = false;

  login(username: string, password: string) {
    return this.http
      .post<any>(`${config.url}/users/login`, {
        username: username,
        password: password
      })
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user));
          }

          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
  }
  getUsers() {
    return this.http.get(`${config.url}/user/all`);
  }
  getUser(cred) {
    return this.http.get(`${config.url}/user/${cred}`);
  }
  createUser(user) {
    return this.http.post<any>(`${config.url}/user/create`, user);
  }
  createLocation(location) {
    return this.http.post<any>("${config.url}/location/create", location);
  }
  getUserLocations(userId) {
    return this.http.get("https://jsonplaceholder.typicode.com/users");
  }
}
