import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "../user.service";

type Register = {
  email: string;
  name: string;
  password: string;
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

  model: Register = { email: "", name: "", password: "" };

  constructor(private userData: UserService, private router: Router) {}

  handleRegister() {
    this.userData.register(this.model).subscribe(e => {
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
