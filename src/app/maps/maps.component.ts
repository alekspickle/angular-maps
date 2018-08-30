import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {} from "@types/googlemaps";
import { UserService } from "../user.service";
import { LocationService } from "../location.service";
import { types } from ".././constants/locations";

declare const google: any;
type Pos = { lat: number; lng: number };
type Search = {
  radius: number;
  type: string;
};
type Loc = {
  name: string;
  type: string;
  lat: number;
  lng: number;
  user_id: string;
};

@Component({
  selector: "g-map",
  templateUrl: "./maps.component.html",
  styleUrls: ["./maps.component.css"]
})
export class MapsComponent implements OnInit, AfterViewInit {
  @ViewChild("gmap")
  gmapElement: any;
  types: object[] = types;
  defLocs: object[] = [];
  search: Search = {
    radius: 0,
    type: ""
  };
  public isModalShow: boolean = false;
  public newLocs: object[] = [];
  public allLocs: object[] = this.defLocs.concat(this.newLocs);
  public currentMarker: Pos;
  public markers: google.maps.Marker[] = [];
  public isMarkersVisible: boolean = true;
  infoWindow = new google.maps.InfoWindow({
    content: `<div>/('0'/)\\|/ (/_0_)/</div>`
  });
  private pos: Pos = {
    lat: 46.4598865,
    lng: 30.7717048
  };
  private map: any;

  constructor(
    private userService: UserService,
    private locationService: LocationService,
    private router: Router
  ) {}

  _markerHandler(event: google.maps.MouseEvent, marker: google.maps.Marker) {
    this.infoWindow.close();
    this.infoWindow.setPosition(event.latLng);
    this.infoWindow.open(this.map, marker);
    // console.log(event.latLng.lat(), event.latLng.lng());
    //show modal
    this.handleToggleModal();
    this.handleChangeCurrentMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  }

  _mapCenter(lat: number, lng: number) {
    return new google.maps.LatLng(lat, lng);
  }

  _placeMarker(location: Pos, add?: boolean) {
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      draggable: true
    });
    // console.log("currentUser", this.userService.currentUser);
    this.handleChangeCurrentMarker(location);
    console.log("place marker", marker);
    const isExists = this.markers.find(
      // el => console.log("marker i suppose? ", el)
      el => el["lat"] === location.lat && el["lng"] === location.lng
    );
    console.log("isExists", isExists);
    if(isExists) return;
    this.markers.push(marker);
    marker.addListener("click", (event: google.maps.MouseEvent) =>
      this._markerHandler(event, marker)
    );
    // if (add)
    //   this.handleAddLocation({
    //     name: "New Location",
    //     type: "park",
    //     lat: location.lat,
    //     lng: location.lng,
    //     user_id: this.userService.currentUser["_id"] || "common"
    //   });
    return marker;
  }
  handleChangeCurrentMarker(latLng: Pos) {
    this.currentMarker = latLng;
    console.log("change current marker", latLng);
  }

  handleAddLocation(location: Loc) {
    console.log(location, this.allLocs);
    this.newLocs.push(location);
    this.allLocs = this.defLocs.concat(this.newLocs);
    let marker = this.allLocs.find(
      el =>
        el["lat"] === this.currentMarker.lat &&
        el["lng"] === this.currentMarker.lng
    );
    marker = { ...location };
    console.log("edited", marker, "all", this.allLocs);
  }
  handleDeleteLocation(location: any) {
    console.log("location", location);
    this.locationService
      .deleteLocation(location)
      .subscribe(result => console.log("deletion result", result));
    this.handleRefreshLocations();
    console.log(
      "all",
      this.allLocs,
      "new",
      this.newLocs,
      "markers",
      this.markers
    );
  }

  handleToggleModal() {
    this.isModalShow = !this.isModalShow;
    console.log(
      "toggle modal",
      this.isModalShow,
      "is markers visible",
      this.isMarkersVisible,
      "markers",
      this.markers,
      "user",
      this.userService.currentUser
    );
  }
  handleToggleMarkers() {
    this.isMarkersVisible = !this.isMarkersVisible;
    console.log(
      "toggle modal",
      this.isModalShow,
      "is markers visible",
      this.isMarkersVisible,
      "markers",
      this.markers,
      "user",
      this.userService.currentUser
    );
  }
  handleClear() {
    this.newLocs = [];
    this.allLocs = this.defLocs;
    this.isModalShow = false;
    this.markers = [];
  }
  handleSetMapOnAll(map) {
    const array = this.markers;
    for (var i = 0; i < array.length; i++) {
      array[i].setMap(map);
    }
  }

  //PLACES
  handleSearchPlaces() {
    const { radius, type } = this.search;
    const lat = this.currentMarker.lat;
    const lng = this.currentMarker.lng;
    const request = {
      location: new google.maps.LatLng(lat, lng),
      radius: radius,
      type: [type]
    };

    const service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch(request, this.placesCallback);
  }
  placesCallback(results, status) {
    debugger;
    console.log("we are in callback");
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(el => {
        const place = el.geometry.location;
        console.log("place", place);
        // this._placeMarker(place);
      });
    }
  }
  handleRefreshLocations() {
    const user = this.userService.currentUser;
    this.locationService.getUserLocations(user).subscribe(result => {
      const locs: object[] = result["locations"];
      console.log("locations fetched", locs);
      this.defLocs = locs;
      locs.map(el => this._placeMarker({ lat: el["lat"], lng: el["lng"] }));
      this.allLocs = this.defLocs.concat(this.newLocs);
    });
  }
  ngOnInit() {
    if (!this.userService.isAuthorized) this.router.navigate(["/login"]);
    this.handleRefreshLocations();
    //init map
    this.map = new google.maps.Map(this.gmapElement.nativeElement, {
      zoom: 11,
      zoomControl: true,
      streetViewControl: true,
      center: this._mapCenter(this.pos.lat, this.pos.lng)
    });
    //add marker on map click
    this.map.addListener("click", (event: google.maps.MouseEvent) => {
      this._placeMarker(
        { lat: event.latLng.lat(), lng: event.latLng.lng() },
        true
      );
    });
    //add current location marker
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.pos.lat = pos.coords.latitude;
        this.pos.lng = pos.coords.longitude;
      });
      const current = this.markers.find(
        el =>
          el["position"]["lat"]() === this.pos.lat &&
          el["position"]["lng"]() === this.pos.lng
      );
      if (!current) this._placeMarker(this.pos, true);
      return;
    }
  }

  ngAfterViewInit() {
    //add all user markers
    this.allLocs.forEach(el =>
      this._placeMarker({ lat: el["lat"], lng: el["lng"] })
    );
    console.log("maps update");
    //toggle markers
    if (!this.isMarkersVisible) this.handleSetMapOnAll(null);
    else this.handleSetMapOnAll(this.map);
  }
}
