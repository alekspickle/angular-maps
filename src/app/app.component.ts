import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "./user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = `Welcome to the club ${this.username || ''}`;
  username: string = this.userData.currentUser && this.userData.currentUser['name']
  isLogoutButtonShow: boolean = false;

  constructor(private userData: UserService,  private router: Router) {
    if (userData.isAuthorized) this.isLogoutButtonShow = true;
  }

  handleLogout(){
    this.userData.logout();
  }

  ngOnInit(){
    // console.log(this.router.location._platformStrategy._platformLocation.location)
  }
}
