import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"]
})
export class AuthComponent implements OnInit {
  user$: Object;
  email: string;
  password: string;
  result: string;
  model = new AuthService("", "");
  constructor(private userData: UserService) {}

  onSubmit() {
    const { email, password } = this.model;
    console.log("hello", email, password);
  }
  
  ngOnInit() {
    this.userData.getUsers().subscribe(data => (this.user$ = data));
    console.log('data', this.user$);
  }
}
