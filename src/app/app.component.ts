import { Component, AfterContentChecked, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "./user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, AfterContentChecked {
  username: string =
    this.userService.currentUser && this.userService.currentUser["name"];
  title = ``;
  isLogoutButtonShow: boolean = false;
  isModalShow: boolean = false;
  constructor(private userService: UserService, private router: Router) {}
  handleLogout() {
    this.userService.logout();
  }
  ngOnInit() {
    this.router.navigate(["/"]);
  }
  ngAfterContentChecked() {
    // console.log("is online: ", window.navigator.onLine); //ONLINE CHECK
    this.username =
      this.userService.currentUser && this.userService.currentUser["name"];
    this.title = `Welcome to the club ${this.username || ""}`;
    if (this.userService.isAuthorized) this.isLogoutButtonShow = true;
  }
}
