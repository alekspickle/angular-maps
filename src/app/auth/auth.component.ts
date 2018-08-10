import { Component, OnInit } from "@angular/core";
import {Router} from '@angular/router'
import { UserService } from "../user.service";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"]
})
export class AuthComponent implements OnInit {
  users$: any;
  email: string;
  password: string;
  result: Object;
  isAuthorized: boolean;

  model = new AuthService("", "");
  constructor(private userData: UserService, private router: Router) {}
  onSubmit() {
    const { email, password } = this.model;
    this.userData.login(email, password).subscribe(e => {
      this.isAuthorized = true
      this.router.navigate(['/map'])
      console.log('login result', this.isAuthorized);
    });
    console.log('isAuthorized',this.isAuthorized)

  }
  check() {
    console.log("data", this.users$ || "no data");
  }
  ngOnInit() {
    this.userData.getUsers().subscribe(data => {
      this.users$ = data;
    });
  }
}
