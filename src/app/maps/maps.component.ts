import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import {} from "@types/googlemaps";
import { UserService } from "../user.service";
import { LocationService } from "../location.service";
import { types } from ".././constants/locations";

declare const google: any;
type Pos = { lat: number; lng: number };
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
  types: Object[] = types;
  isModalShow: boolean = false;
  defLocs: Object[] = [];
  newLocs: Object[] = [];
  allLocs: Object[] = this.defLocs.concat(this.newLocs);
  currentMarker: Pos;
  markers: google.maps.Marker[] = [];
  isMarkersVisible: boolean = true;
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
    private locationService: LocationService
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
    console.log("place marker", marker);
    this.markers.push(marker);
    marker.addListener("click", (event: google.maps.MouseEvent) =>
      this._markerHandler(event, marker)
    );
    if (add)
      this.handleAddLocation({
        name: "New Location",
        type: "park",
        lat: location.lat,
        lng: location.lng,
        user_id: this.userService.currentUser["_id"] || "common"
      });
    return marker;
  }
  handleChangeCurrentMarker(latLng: Pos) {
    this.currentMarker = latLng;
  }

  handleAddLocation(location: Loc) {
    this.newLocs.push(location);
    this.allLocs = this.defLocs.concat(this.newLocs);
  }

  

  handleDeleteLocation(location: any) {
    console.log("location", location);
    this.newLocs.filter(el => location._id !== el["_id"]);
    this.allLocs.filter(el => location._id !== el["_id"]);
    console.log("all", this.allLocs, "new", this.newLocs);
  }

  handleToggleModal() {
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
  handleToggleMarkers() {
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
  handleTogglePlaces(place) {
    const lat = this.currentMarker.lat;
    const lng = this.currentMarker.lng;
    const request = {
      location: new google.maps.LatLng(lat, lng),
      radius: place.radius,
      type: [place.type]
    };

    const service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch(request, this.callback);
  }
  callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        const place = results[i];
        this._placeMarker(place);
      }
    }
  }

  ngOnInit() {
    const user = this.userService.currentUser;
    this.locationService.getUserLocations(user).subscribe(result => {
      const locs: Array<object> = result["locations"];
      console.log("locations fetched", locs);
      this.defLocs = locs;
      this.markers = locs.map(el =>
        this._placeMarker({ lat: el["lat"], lng: el["lng"] })
      );
      this.allLocs = this.defLocs.concat(
        this.newLocs
      );
    });

    //init map
    this.map = new google.maps.Map(this.gmapElement.nativeElement, {
      zoom: 11,
      zoomControl: true,
      streetViewControl: true,
      center: this._mapCenter(this.pos.lat, this.pos.lng)
    });

    //add marker on click
    this.map.addListener("click", (event: google.maps.MouseEvent) => {
      console.log("click map", event);
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
        el => el["position"]
        // el["position"]["lat"]() === this.pos.lat &&
        // el["position"]["lng"]() === this.pos.lng
      );
      console.log("your position", current);
      if (!current) this._placeMarker(this.pos);
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
