import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(public email: string, public password: string) {}

  create(email, name, password) {
    console.log("email", email);
  }
}
