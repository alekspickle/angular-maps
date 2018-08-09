import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { RegisterService } from "../register.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  email: string;
  name: string;
  password: string;

  model = new RegisterService("", "", "");

  constructor(private userData: UserService) {}

  onRegister() {
    this.userData
      .createUser(this.model)
      .subscribe(e => console.log("create user response", e));
    console.log("REGISTER");
  }
  
  ngOnInit() {}
}
