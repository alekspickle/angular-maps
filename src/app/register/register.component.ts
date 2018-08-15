import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "../user.service";
import { map, catchError } from "rxjs/operators";

type Register = {
  email: string;
  name: string;
  password: string;
  userExists: boolean;
};

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  email: string;
  name: string;
  password: string;

  model: Register = { email: "", name: "", password: "", userExists: false };

  constructor(private userData: UserService, private router: Router) {}
  handleExists() {
    this.model.userExists = true;
  }
  handleRegister() {
    this.userData
      .register(this.model)
      .pipe(
        catchError(val => {
          this.handleExists();
          return `Cought: ${val}`;
        })
      )
      .subscribe(e => {
        this.handleSetRegistered(e);
        console.log("create user response", e);
      });
  }
  handleSetRegistered(response): Observable<Object> {
    if (response.registered) this.router.navigate(["/login"]);
    return;
  }
  ngOnInit() {}
}
