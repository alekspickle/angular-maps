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
  constructor(private userService: UserService, private router: Router) {}
  onSubmit() {
    const { email, password } = this.model;
    this.userService.login(email, password);
  }
  //TEST IF THERE ARE USERS
  check() {
    this.userService.check().subscribe(result => {
      this.users$ = result['users']
      console.log("data", this.users$ || "no data");

    })
  }

  ngOnInit() {
    this.userService.getUsers().subscribe(data => {
      this.users$ = data;
    });
  }
  ngAfterViewInit() {
    const { isAuthorized } = this.userService;
    if (isAuthorized) this.router.navigate(["/map"]);
  }
}
