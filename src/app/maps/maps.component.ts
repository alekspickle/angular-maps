import {
  AfterContentInit,
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
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
export class MapsComponent implements OnInit, AfterContentInit {
  @ViewChild("gmap")
  gmapElement: any;
  types: object[] = types;
  defLocs: object[] = [];
  search: Search = {
    radius: 0,
    type: ""
  };
  action: string = "Add";
  public currentMarker: Pos;
  public newLocs: object[] = [];
  public nearbyLocs: object[] = [];
  public isModalShow: boolean = false;
  public isMarkersVisible: boolean = true;
  public allLocs: object[] = this.defLocs.concat(this.newLocs);
  public markers: google.maps.Marker[] = [];
  infoWindow = new google.maps.InfoWindow({
    content: `<div>>o<</div>`
  });
  private pos: Pos = {
    lat: 46.4598865,
    lng: 30.7717048
  };
  private map: any;

  constructor(
    private userService: UserService,
    private locationService: LocationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  _markerHandler = (
    event: google.maps.MouseEvent,
    marker: google.maps.Marker
  ) => {
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
  };

  _mapCenter = (lat: number, lng: number) => {
    return new google.maps.LatLng(lat, lng);
  };

  /**
   *
   * @param location
   * @param add to add or not to add to locations list.
   */
  _placeMarker = (location: Pos | any, add?: boolean, googleMarker? : any) => {
    const isExists = this.markers.find(
      el =>
        el.getPosition().lat() === location.lat &&
        el.getPosition().lng() === location.lng
    );
    if (isExists) return; //TODO FIX
    this.handleChangeCurrentMarker(location);
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      draggable: true,
      // icon: googleMarker.icon || null
    });
    // console.log("currentUser", this.userService.currentUser);
    // console.log("place marker", marker, this.markers.length);
    this.markers.push(marker);
    marker.addListener("click", (event: google.maps.MouseEvent) => {
      if (marker.getAnimation() !== null) {
        // marker.setAnimation(null);
      } else {
        // marker.setAnimation(google.maps.Animation.BOUNCE);
      }
      this._markerHandler(event, marker);
    });
    if (add)
      this.handleAddLocation(googleMarker);
  };

  handleChangeCurrentMarker = (latLng: Pos) => {
    this.currentMarker = latLng;
    const element = this.markers.find(
      el =>
        el.getPosition().lat() === latLng.lat &&
        el.getPosition().lng() === latLng.lng
    );
    if (element) this.action = "Edit";
    else this.action = "Add";
  };

  handleAddLocation = (location: Loc | any) => {
    console.log(location, this.allLocs);
    console.log("type of location", typeof location);
    this.newLocs.push(location);
    this.allLocs = this.defLocs.concat(this.newLocs);
    let marker = this.allLocs.find(
      el =>
        el["lat"] === this.currentMarker.lat &&
        el["lng"] === this.currentMarker.lng
    );
    marker = { ...location };
    console.log("edited", marker, "all", this.allLocs);
  };
  handleEditLocation = (location: Loc) => {
    const index = this.allLocs.indexOf(location);
    console.log("location index", index);
  };
  handleDeleteLocation = (location: any) => {
    console.log("location", location);
    this.locationService.deleteLocation(location).subscribe(result => {
      this.handleRefreshLocations();
      console.log("deletion result", result);
    });
  };
  handleToggleModal = () => {
    this.isModalShow = !this.isModalShow;
    console.log(
      "modal",
      this.isModalShow,
      "markers",
      this.isMarkersVisible,
      "markers",
      this.markers,
      "current",
      this.currentMarker
    );
    this.cdr.detectChanges();
  };

  handleToggleMarkers = () => {
    this.isMarkersVisible = !this.isMarkersVisible;
    if (this.isMarkersVisible) this.handleSetMapOnAll(this.map);
    else this.handleSetMapOnAll(null);
    console.log(
      "modal",
      this.isModalShow,
      "markers",
      this.isMarkersVisible,
      "markers",
      this.markers,
      "current",
      this.currentMarker
    );
  };
  handleSetMapOnAll = map => {
    const array = this.markers;
    for (let i = 0; i < array.length; i++) {
      array[i].setMap(map);
    }
  };

  //PLACES
  handleSearchPlaces = () => {
    const { radius, type } = this.search;
    const lat = this.currentMarker.lat;
    const lng = this.currentMarker.lng;
    const request = {
      location: new google.maps.LatLng(lat, lng),
      radius: radius,
      type: [type]
    };

    const service = new google.maps.places.PlacesService(this.map);
    debugger;
    service.nearbySearch(request, this.placesCallback);
  };
  placesCallback = (results, status) => {
    debugger;
    console.log("we are in callback");
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(el => {
        const place = el.geometry.location;
        console.log("place", place, this);
        this._placeMarker(place, true, el);
      });
    }
    this.cdr.detectChanges();
  };
  handleRefreshLocations = () => {
    const user = this.userService.currentUser;
    this.locationService.getUserLocations(user).subscribe(result => {
      const locs: object[] = result["locations"];
      console.log("Refresh", locs);
      this.defLocs = locs;
      locs.map(el => this._placeMarker({ lat: el["lat"], lng: el["lng"] }));
      this.allLocs = this.defLocs.concat(this.newLocs);
    });
  };

  handleClear = () => {
    this.newLocs = [];
    this.allLocs = this.defLocs;
    this.isModalShow = false;
    this.markers = [];
  };
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
      this._placeMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    });
    //add current location marker
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.pos.lat = pos.coords.latitude;
        this.pos.lng = pos.coords.longitude;
      });
      const current = this.markers.find(
        el =>
          el.getPosition().lat() === this.pos.lat &&
          el.getPosition().lng() === this.pos.lng
      );
      if (!current) this._placeMarker(this.pos);
      return;
    }
  }

  ngAfterContentInit() {
    //add all user markers
    this.allLocs.forEach(el =>
      this._placeMarker({ lat: el["lat"], lng: el["lng"] })
    );
    console.log("maps update");
  }
}
