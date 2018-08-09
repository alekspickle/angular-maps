import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"]
})
export class AuthComponent implements OnInit {
  users$: Object;
  email: string;
  password: string;
  result: Object;
  isAuthorized: boolean;

  model = new AuthService("", "");
  constructor(private userData: UserService) {}

  onSubmit() {
    const { email, password } = this.model;
    this.userData.login(email, password).subscribe(e => (this.result = e));
    console.log("hello", email, password);
  }

  ngOnInit() {
    this.userData.getUsers().subscribe(data => this.users$ = data);
    console.log("data", this.users$ || "no data");
  }
}
