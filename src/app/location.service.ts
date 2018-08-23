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
  newLocs: Object[] = [];
  allLocs: Object[] = this.defLocs.concat(this.newLocs);
  currentMarker: Pos;
  markers: google.maps.Marker[] = [];
  public isMarkersVisible: boolean = true;
  public isModalShow: boolean = false;

  constructor(public http: HttpClient, public router: Router) {}
  onToggleModal() {
    this.isModalShow = !this.isModalShow;
    console.log(
      "toggle modal",
      this.isModalShow,
      "is markers visible",
      this.isMarkersVisible,
      "markers",
      this.markers
    );
  }

  onToggleMarkers() {
    this.isMarkersVisible = !this.isMarkersVisible;
    console.log(
      "toggle modal",
      this.isModalShow,
      "is markers visible",
      this.isMarkersVisible,
      "markers",
      this.markers
    );
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
    this.isModalShow = false;
    this.markers = []
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
