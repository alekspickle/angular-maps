import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { config } from "./constants/locations";
type Loc = {
  name: string;
  type: string;
  lat: number;
  lng: number;
  user_id: string;
};

type Pos = { lat: number; lng: number };

@Injectable({
  providedIn: "root"
})
export class LocationService {
  defLocs: Object[] = [];
  // defLocs: Object[] = mockData;
  newLocs: Object[] = [];
  allLocs: Object[] = this.defLocs.concat(this.newLocs);
  currentMarker: Pos;
  markers: google.maps.Marker[] = [];
  isMarkersVisible: boolean = true;
  public isModalShow: boolean = false;

  constructor(public http: HttpClient, public router: Router) {}
  onToggleModal() {
    this.isModalShow = !this.isModalShow;
    console.log("toggle modal");
  }
  onSetMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }
  onToggleMarkers(map) {
    if(this.isMarkersVisible) this.onSetMapOnAll(null)
    else this.onSetMapOnAll(map)
    this.isMarkersVisible = !this.isMarkersVisible;

  }

  onChangeCurrentMarker(latLng: Pos) {
    this.currentMarker = latLng;
  }

  onAddLocation(location: Loc) {
    this.newLocs.push(location);
    this.allLocs = this.defLocs.concat(this.newLocs);
  }

  onClear() {
    this.newLocs = [];
    this.allLocs = this.defLocs;
  }

  onDeleteLocation(location: any) {
    console.log("location", location);
    this.newLocs.filter(el => location._id !== el["_id"]);
    this.allLocs.filter(el => location._id !== el["_id"]);
    console.log("all", this.allLocs, "new", this.newLocs);
  }

  getUserLocations(user) {
    return this.http
      .get<Object[]>(`${config.url}/location/${user._id}`)
      .subscribe(result => {
        const locs: Array<object> = result["locations"];
        console.log("locations fetched", locs, typeof locs);
        this.defLocs = locs;
        this.allLocs = this.defLocs.concat(this.newLocs);
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
