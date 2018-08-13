import { Component, OnInit, AfterViewInit, OnChanges } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../user.service";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"]
})
export class AuthComponent implements OnInit, AfterViewInit, OnChanges {
  users$: any;
  email: string;
  password: string;
  result: Object;

  model = new AuthService("", "");
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
  ngOnChanges(){
    const { isAuthorized } = this.userData;
    console.log(isAuthorized);
  }
}
