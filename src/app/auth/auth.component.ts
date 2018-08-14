import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../user.service";

type Auth = {
  email: string;
  password: string;
};

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"]
})
export class AuthComponent implements OnInit, AfterViewInit {
  users$: any;
  email: string;
  password: string;
  result: Object;

  model: Auth = { email: "", password: "" };
  constructor(private userData: UserService, private router: Router) {}
  onSubmit() {
    const { email, password } = this.model;
    this.userData.login(email, password);
  }
  //TEST IF THERE ARE USERS
  check() {
    console.log("data", this.users$ || "no data");
  }

  ngOnInit() {
    this.userData.getUsers().subscribe(data => {
      this.users$ = data;
    });
  }
  ngAfterViewInit() {
    const { isAuthorized } = this.userData;
    // if (isAuthorized) this.router.navigate(["/map"]);
  }
}
