import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import {} from "@types/googlemaps";
import { UserService } from "../user.service";
import { LocationService } from "../location.service";
import { types } from ".././constants/locations";

declare const google: any;
type Pos = { lat: number; lng: number };

@Component({
  selector: "g-map",
  templateUrl: "./maps.component.html",
  styleUrls: ["./maps.component.css"]
})
export class MapsComponent implements OnInit, AfterViewInit {
  @ViewChild("gmap")
  gmapElement: any;
  infoWindow = new google.maps.InfoWindow({
    content: `<div class='popup'>/('0'/)how do I paste something here? (/_0_)/</div>`
  });
  types: Object[] = types;
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
    console.log(event.latLng.lat(), event.latLng.lng());
    //show modal
    this.locationService.onToggleModal();
    this.locationService.onChangeCurrentMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  }

  _mapCenter(lat: number, lng: number) {
    return new google.maps.LatLng(lat, lng);
  }

  _placeMarker(location: Pos) {
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      draggable: true
    });
    console.log("currentUser", this.userService.currentUser);
    //popup info window
    console.log(marker);
    this.locationService.markers.push(marker);
    marker.addListener("click", (event: google.maps.MouseEvent) =>
      this._markerHandler(event, marker)
    );
    this.locationService.onAddLocation({
      name: "New Location",
      type: "park",
      lat: location.lat,
      lng: location.lng,
      user_id: this.userService.currentUser["_id"] || "common"
    });
    return marker;
  }
  
  handleTogglePlaces(place) {
    const lat = this.locationService.currentMarker.lat;
    const lng = this.locationService.currentMarker.lng;
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
    //init map
    this.map = new google.maps.Map(this.gmapElement.nativeElement, {
      zoom: 11,
      zoomControl: true,
      streetViewControl: true,
      center: this._mapCenter(this.pos.lat, this.pos.lng)
    });

    //add marker on click
    this.map.addListener("click", (event: google.maps.MouseEvent) => {
      console.log(event);
      this._placeMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    });

    //add current location marker
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.pos.lat = pos.coords.latitude;
        this.pos.lng = pos.coords.longitude;
      });
      const current = this.locationService.markers.find(
        el => el["position"]
        // el["position"]["lat"]() === this.pos.lat &&
        // el["position"]["lng"]() === this.pos.lng
      );
      console.log("your position", current);
      // if (!current) this._placeMarker(this.pos);
      return;
    }
  }

  ngAfterViewInit() {
    //add all user markers
    this.locationService.allLocs.forEach(el =>
      this._placeMarker({ lat: el["lat"], lng: el["lng"] })
    );
    console.log("maps update");
  }
}
