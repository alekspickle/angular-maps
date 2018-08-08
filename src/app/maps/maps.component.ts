import { ViewChild, Component } from "@angular/core";
import { Observable } from "rxjs";
// import { } from "@types/googlemaps";
import { UserService } from "../user.service";

type Pos = { lat: number; lng: number };

@Component({
  selector: "g-map",
  templateUrl: "./maps.component.html",
  styleUrls: ["./maps.component.css"]
})
export class MapsComponent {
  // @ViewChild("gmap") gmapElement: any;
  // map: google.maps.Map;
  // mapRef: google.maps.Map;
  // bounds: google.maps.LatLngBounds;
  // latLng: google.maps.LatLng;
  // user$: Object;
  // private pos: Pos = {
  //   lat: 46.4598865,
  //   lng: 30.5717048
  // };

  // constructor(private userData: UserService) {}
  // ngOnInit() {
  //   this.userData.getUsers().subscribe(data => (this.user$ = data));

  //   const mapProp = {
  //     center: new google.maps.LatLng(18.5793, 73.8143),
  //     zoom: 15,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //   };
  //   this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  // }
}
