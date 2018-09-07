import { Component, AfterContentChecked } from "@angular/core";
import { UserService } from "./user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements AfterContentChecked {
  username: string =
    this.userService.currentUser && this.userService.currentUser["name"];
  title = ``;
  isLogoutButtonShow: boolean = false;
  isModalShow: boolean = false;
  constructor(
    private userService: UserService,
  ) {}
  handleLogout() {
    this.userService.logout();
  }

  ngAfterContentChecked() {
    // console.log("is online: ", window.navigator.onLine); //ONLINE CHECK
    this.username =
      this.userService.currentUser && this.userService.currentUser["name"];
      this.title = `Welcome to the club ${this.username || ""}`
    if (this.userService.isAuthorized) this.isLogoutButtonShow = true;
  }
}
