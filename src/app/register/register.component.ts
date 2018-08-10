import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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
  isRegistered: boolean = false;

  model = new RegisterService("", "", "");

  constructor(private userData: UserService, private router: Router) {}

  onRegister() {
    this.userData.createUser(this.model).subscribe(e => {
      // this.isRegistered = e.registered
      this.router.navigate(['/login'])
      console.log("create user response", e);
    });
    console.log("REGISTER");
  }

  ngOnInit() {}
}
