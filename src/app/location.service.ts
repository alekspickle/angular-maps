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
  defLocs: Object[] = mockData;
  newLocs: Object[] = [];
  allLocs: Object[]= this.defLocs.concat(this.newLocs)

  constructor(public http: HttpClient, public router: Router) {}
  onAddLocation(location: any ){
    this.newLocs.push(location)
  }
  onClear() {
    this.newLocs = []
  }
  onDeleteLocation(location: any){
    this.newLocs.unshift(location)
  }
  getUserLocations(user) {
    return this.http.get(`${config.url}/location/${user._id}`).subscribe(locations => {
      console.log("locations fetched", locations);

    });;
  }
  saveCurrentLocations(locations: Object[]){
    return this.http.post(`${config.url}/location/save`, locations)
  }
  createLocation(location: any) {
    return this.http.post(`${config.url}/location/create`, location);
  }
  
  deleteLocation(location: any) {
    return this.http.delete(`${config.url}/location/${location._id}`, location);
  }

  
}
