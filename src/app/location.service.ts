import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

const mockData = [
  {
    name: "moldavanka",
    type: "restaurant",
    lat: 46.3998865,
    lng: 30.6717048,
    user_id: "5b72d640e254cb4ab76c0c26"
  },
  {
    name: "anywhere",
    type: "park",
    lat: 46.4619865,
    lng: 30.7518048,
    user_id: "5b72d640e254cb4ab76c0c26"
  },
  {
    name: "elsewhere",
    type: "beach",
    lat: 46.460865,
    lng: 30.6719048,
    user_id: "5b72d640e254cb4ab76c0c26"
  },
  {
    name: "softwhere",
    type: "restaurant",
    lat: 46.390165,
    lng: 30.7720048,
    user_id: "5b72d640e254cb4ab76c0c26"
  }
];

const config = {
  url: "http://localhost:3001"
  // url: "https://maps-test.herokuapp.com"
};

type Pos = { lat: number; lng: number };

@Injectable({
  providedIn: "root"
})
export class LocationService {
  defLocs: Object[] = mockData;
  newLocs: Object[] = [];
  allLocs: Object[] = this.defLocs.concat(this.newLocs);
  currentMarker: Pos;
  isModalShow: boolean = false;

  constructor(public http: HttpClient, public router: Router) {}
  onToggleModal() {
    this.isModalShow = !this.isModalShow;
  }
  onChangeCurrentMarker(latLng: Pos){
    this.currentMarker = latLng
  }
  onAddLocation(location: any) {
    this.newLocs.push(location);
  }
  onClear() {
    this.newLocs = [];
  }
  onDeleteLocation(location: any) {
    this.newLocs.unshift(location);
  }
  getUserLocations(user) {
    return this.http
      .get(`${config.url}/location/${user._id}`)
      .subscribe(locations => {
        console.log("locations fetched", locations);
      });
  }
  saveCurrentLocations(locations: Object[]) {
    return this.http.post(`${config.url}/location/save`, { locations });
  }
  createLocation(location: any) {
    return this.http.post(`${config.url}/location/create`, location);
  }

  deleteLocation(location: any) {
    return this.http.delete(`${config.url}/location/${location._id}`, location);
  }
}
