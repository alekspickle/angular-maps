import { Component, OnInit, AfterContentChecked  } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "./user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit,AfterContentChecked {
  username: string = this.userService.currentUser && this.userService.currentUser['name']
  title = `Welcome to the club ${this.username || ''}`;
  isLogoutButtonShow: boolean = false;

  constructor(private userService: UserService,  private router: Router) {
    if (userService.isAuthorized) this.isLogoutButtonShow = true;
  }

  handleLogout(){
    this.userService.logout();
  }

  ngOnInit(){
    // console.log(this.router.location._platformStrategy._platformLocation.location)
  }
  ngAfterContentChecked(){
    this.username =this.userService.currentUser && this.userService.currentUser['name'] 
  }
}
