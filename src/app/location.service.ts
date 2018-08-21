import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

const mockData = [
  {
    _id: "grjvndhto493c61581c9fe11",
    name: "moldavanka",
    type: "park",
    lat: 46.3998865,
    lng: 30.6717048,
    user_id: "5b72d640e254cb4ab76c0c26"
  },
  {
    _id: "grjvndhto493c61581c9fe12",
    name: "center",
    type: "restaurant",
    lat: 46.4619865,
    lng: 30.7518048,
    user_id: "5b72d640e254cb4ab76c0c26"
  },
  {
    _id: "grjvndhto493c61581c9fe13",
    name: "bus station",
    type: "beach",
    lat: 46.460865,
    lng: 30.6719048,
    user_id: "5b72d640e254cb4ab76c0c26"
  },
  {
    _id: "grjvndhto493c61581c9fe14",
    name: "langeron",
    type: "beach",
    lat: 46.4100529,
    lng: 30.7362992,
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
  isMarkersVisible: boolean = true;

  constructor(public http: HttpClient, public router: Router) {}
  onToggleModal() {
    this.isModalShow = !this.isModalShow;
  }

  onToggleMarkers() {
    this.isMarkersVisible = !this.isMarkersVisible;
  }
  onChangeCurrentMarker(latLng: Pos) {
    this.currentMarker = latLng;
  }
  onAddLocation(location: any) {
    this.newLocs.push(location);
    this.allLocs.push(location);
  }
  onClear() {
    this.newLocs = [];
  }
  onDeleteLocation(location: any) {
    console.log(
      "location",
      location,
      this.allLocs.find(el => (location._id = el["_id"]))
    );
    this.allLocs.filter(el => location._id !== el["_id"]);
    this.newLocs.filter(el => location._id !== el["_id"]);
    console.log("all", this.allLocs, "new", this.newLocs);
  }

  getUserLocations(user) {
    return this.http
      .get<Object[]>(`${config.url}/location/${user._id}`)
      .subscribe(locations => {
        const locs: Array<object> = locations;
        console.log("locations fetched", locs);
        this.defLocs = locs;
        this.allLocs = locs.concat(this.newLocs);
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
