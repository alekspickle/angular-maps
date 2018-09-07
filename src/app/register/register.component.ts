import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "../user.service";
import { catchError } from "rxjs/operators";

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
  isResponded: boolean = false
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
          return val;
        })
      )
      .subscribe(e => {
        this.handleSetRegistered(e);
      });
  }
  handleSetRegistered(response): Observable<object> {
    if (response.registered) {
      this.isResponded = true
      this.router.navigate(["/login"]);}
    return;
  }
  ngOnInit() {}
}
