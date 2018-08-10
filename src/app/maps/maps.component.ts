declare const google: any;
import {
  AfterViewInit,
  ElementRef,
  Component,
  OnInit,
  ViewChild
} from "@angular/core";
import { } from '@types/googlemaps'
import { Observable } from "rxjs";
import { UserService } from "../user.service";

type Pos = { lat: number; lng: number };

@Component({
  selector: "g-map",
  templateUrl: "./maps.component.html",
  styleUrls: ["./maps.component.css"]
})
export class MapsComponent implements OnInit, AfterViewInit {
  @ViewChild("gmap") gmapElement: any;
  mapRef: google.maps.Map;
  bounds: google.maps.LatLngBounds;
  latLng: google.maps.LatLng;
  user$: Object;
  private pos: Pos = {
    lat: 46.4598865,
    lng: 30.5717048
  };
  private map: any;

  constructor(private userData: UserService) {}

  ngOnInit() {
    const { lat, lng } = this.pos;

    this.userData.getUsers().subscribe(data => (this.user$ = data));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.pos.lat = pos.coords.latitude;
        this.pos.lng = pos.coords.longitude;
      });
    }

    //   const mapProp = {
    //     center: new google.maps.LatLng(lat, lng),
    //     zoom: 15,
    //     mapTypeId: google.maps.MapTypeId.ROADMAP
    //   };
    //   this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    // }
  }

  _mapCenter(lat: number, lng: number) {
    return new google.maps.LatLng(lat, lng);
  }

  _placeMarker(location: Pos) {
    return new google.maps.Marker({
      position: location,
      map: this.map
    });
  }

  ngAfterViewInit() {
    this.map = new google.maps.Map(this.gmapElement.nativeElement, {
      zoom: 11,
      center: this._mapCenter(this.pos.lat, this.pos.lng),
      disableDefaultUI: true
    });

    this.map.addListener("click", (event: google.maps.MouseEvent) => {
      this._placeMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    });
  }
}
