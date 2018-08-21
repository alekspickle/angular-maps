import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import {} from "@types/googlemaps";
import { UserService } from "../user.service";
import { LocationService } from "../location.service";

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

  private pos: Pos = {
    lat: 46.4598865,
    lng: 30.7717048
  };
  private map: any;

  constructor(
    private userData: UserService,
    private locationService: LocationService
  ) {}

  _markerHandler(event: google.maps.MouseEvent, marker: google.maps.Marker) {
    this.infoWindow.close();
    this.infoWindow.setPosition(event.latLng);
    this.infoWindow.open(this.map, marker);
    console.log(event.latLng.lat(), event.latLng.lng());
    //show modal
    this.locationService.onToggleModal();
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

    //popup info window
    marker.addListener("click", (event: google.maps.MouseEvent) =>
      this._markerHandler(event, marker)
    );

    return marker;
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
      this._placeMarker(this.pos);
    }
  }

  ngAfterViewInit() {
    //add all user markers
    this.locationService.allLocs.forEach(el =>
      this._placeMarker({ lat: el["lat"], lng: el["lng"] })
    );
  }
}
