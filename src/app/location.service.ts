import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

const mockData = [
  {
    name: "somewhere",
    type: "restaurant",
    lat: 46.4598865,
    lng: 30.5717048
  },
  {
    name: "anywhere",
    type: "park",
    lat: 46.4599865,
    lng: 30.5718048
  },
  {
    name: "elsewhere",
    type: "beach",
    lat: 46.460865,
    lng: 30.5719048
  },
  {
    name: "softwhere",
    type: "restaurant",
    lat: 46.460165,
    lng: 30.5720048
  }
];

const config = {
  url: "http://localhost:3001"
  // url: "https://maps-test.herokuapp.com"
};

@Injectable({
  providedIn: "root"
})
export class LocationService {
  locations: Object[] = mockData;
  constructor(public http: HttpClient, public router: Router) {}

  getUserLocations(user) {
    console.log("getting user location", user);
    return this.http.get(`${config.url}/location/${user._id}`);
  }
  saveCurrentLocations(locations: Object[]){
    return this.http.post(`${config.url}/location/save`, locations)
  }
  createLocation(location: any) {
    return this.http.post(`${config.url}/location/create`, location);
  }
}
