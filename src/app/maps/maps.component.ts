import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import {} from "@types/googlemaps";
import { UserService } from "../user.service";

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
  mapRef: google.maps.Map;
  bounds: google.maps.LatLngBounds;
  latLng: google.maps.LatLng;
  user$: Object;
  userLocations$: Object;
  private pos: Pos = {
    lat: 46.4598865,
    lng: 30.5717048
  };
  private map: any;

  constructor(private userData: UserService) {}

  
  _markerHandler(marker: google.maps.Marker) {
    const infoWindow = new google.maps.InfoWindow({
      content: "popup, bitch"
    });
    infoWindow.open(this.map, marker)
    console.log("marker", marker);
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
    marker.addListener("click", this._markerHandler);

    return marker;
  }
  ngOnInit() {
    this.userData.getUsers().subscribe(data => (this.user$ = data));
    
    this.map = new google.maps.Map(this.gmapElement.nativeElement, {
      zoom: 11,
      center: this._mapCenter(this.pos.lat, this.pos.lng),
      disableDefaultUI: true
    });
    this.map.addListener("click", (event: google.maps.MouseEvent) => {
      this._placeMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        console.log('your position',pos)
        this.pos.lat = pos.coords.latitude;
        this.pos.lng = pos.coords.longitude;
      });
      this._placeMarker(this.pos);
    }
  }
  
  ngAfterViewInit() {
    
  }
}
