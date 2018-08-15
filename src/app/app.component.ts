import { Component, OnInit, AfterContentChecked } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "./user.service";
import { LocationService } from "./location.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, AfterContentChecked {
  username: string =
    this.userService.currentUser && this.userService.currentUser["name"];
  title = `Welcome to the club ${this.username || ""}`;
  isLogoutButtonShow: boolean = false;
  isModalShow: boolean = false;
  constructor(
    private userService: UserService,
    private locationService: LocationService,
    private router: Router
  ) {
    if (userService.isAuthorized) this.isLogoutButtonShow = true;
  }
  handleToggleModal(){
    this.locationService.onToggleModal()
  }
  handleLogout() {
    this.userService.logout();
  }

  ngOnInit() {
  }
  ngAfterContentChecked() {
    this.username =
      this.userService.currentUser && this.userService.currentUser["name"];
    this.isModalShow = this.locationService.isModalShow;
    if (this.userService.isAuthorized) this.isLogoutButtonShow = true;
  }
}
