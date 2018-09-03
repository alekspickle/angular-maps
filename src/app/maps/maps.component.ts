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

declare let google: any;
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
  infoWindowText: string = '>o<'
  infoWindow = new google.maps.InfoWindow({
    content: `<div>${this.infoWindowText}</div>`
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
  _changeMarkerName = (loc: Pos) => {
    const marker = this.handleIsExists(loc)
    console.log("change marker name", marker);
  }
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
   * @param gMarker to add location
   */
  _placeMarker = (location: Pos, gMarker?: any) => {
    console.log("Check search", location);
    const isExists = this.handleIsExists(location);
    if (isExists) return; //TODO FIX
    this.handleChangeCurrentMarker(location);
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      draggable: true
    });
    //add places icon
    // if (gMarker && gMarker.icon) marker.markerIconUrl(gMarker.icon);
    this.markers.push(marker);
    marker.addListener("click", (event: google.maps.MouseEvent) => {
      // if (marker.getAnimation() !== null) {
      //   marker.setAnimation(null);
      // } else {
      //   marker.setAnimation(google.maps.Animation.BOUNCE);
      // }
      this._markerHandler(event, marker);
    });
    if (gMarker)
      this.handleAddLocation({
        name: gMarker.name,
        type: gMarker.types[0] || gMarker.types,
        lat: location.lat,
        lng: location.lng,
        user_id: this.userService.currentUser["_id"]
      }, true);
  };
  handleIsExists = (loc : Pos) => {
    return this.markers.find(
       el =>
         el.getPosition().lat() === loc.lat &&
         el.getPosition().lng() === loc.lng
     );
   }
  handleChangeCurrentMarker = (latLng: Pos) => {
    this.currentMarker = latLng;
    this._changeMarkerName(latLng)

    const element = this.handleIsExists(latLng)
    if (element) this.action = "Edit";
    else this.action = "Add";
  };

  handleAddLocation = (location: Loc, isPlaces : boolean) => {
    if(isPlaces) return this.nearbyLocs.push(location)
    this.newLocs.push(location);
    this.allLocs = this.defLocs.concat(this.newLocs);
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
    service.nearbySearch(request, this.placesCallback);
  };
  placesCallback = (results, status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(el => {
        const place = el.geometry.location;
        this._placeMarker({ lat: place.lat(), lng: place.lng() }, el);
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
