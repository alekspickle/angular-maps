import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Headers } from "@angular/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

const config = {
  url: "http://localhost:3001"
  // url: "https://maps-test.herokuapp.com"
};

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(public http: HttpClient, public router: Router) { }

  getUserLocations(user) {
    return this.http.get(`${config.url}/location/${user._id}`);
  }

  createLocation(location: any) {
    return this.http.post(`${config.url}/location/create`, location);
  }

}
