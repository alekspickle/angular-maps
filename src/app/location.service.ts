import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { config } from "./constants/locations";

@Injectable({
  providedIn: "root"
})
export class LocationService {
  constructor(public http: HttpClient, public router: Router) {}

  getUserLocations(user) {
    return this.http.get<object[]>(`${config.url}/location/${user._id}`);
  }
  saveCurrentLocations(locations: object[]) {
    return this.http.post(`${config.url}/location/save`, { locations });
  }
  createLocation(location: any) {
    return this.http.post(`${config.url}/location/create`, location);
  }
  updateLocation(location: any) {
    return this.http.put(`${config.url}/location/update`, location);
  }
  deleteLocation(location: any) {
    return this.http.delete(`${config.url}/location/${location._id}`, location);
  }
}
