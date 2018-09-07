import {
  // AfterContentChecked,
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
export class MapsComponent implements OnInit {
  @ViewChild("gmap")
  gmapElement: any;
  types: object[] = types;
  defLocs: object[] = [];
  search: Search = {
    radius: 0,
    type: ""
  };
  public currentMarker: Pos = {
    lat: 46.473,
    lng: 30.7412
  };
  public isUpdate: boolean = false;
  public newLocs: object[] = [];
  public nearbyLocs: object[] = [];
  public isModalShow: boolean = false;
  public isMarkersVisible: boolean = true;
  public allLocs: object[] = this.defLocs.concat(this.newLocs);
  public markers: google.maps.Marker[] = [];
  public nearbyMarkers: google.maps.Marker[] = [];
  public infoWindowText: string = "";
  public infoWindow: google.maps.InfoWindow = new google.maps.InfoWindow();
  private pos: Pos = Object.assign(this.currentMarker);
  private map: any;

  constructor(
    private userService: UserService,
    private locationService: LocationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  _deleteLoc(loc: Loc) {
    this.newLocs = this.newLocs.filter(
      el => loc.lat !== el["lat"] && loc.lng !== el["lng"]
    );
    this.allLocs = this.allLocs.filter(
      el => loc.lat !== el["lat"] && loc.lng !== el["lng"]
    );
    this.markers = this.markers.filter(
      el =>
        loc.lat !== el.getPosition().lat() && loc.lng !== el.getPosition().lng()
    );
    this.handleRefreshLocations();
  }
  _findMarker = (loc: Pos) => {
    // console.log("this.markers", this.markers);
    return (
      this.markers.length &&
      this.markers
        .concat(this.nearbyMarkers)
        .find(
          el =>
            el.getPosition().lat() === loc.lat &&
            el.getPosition().lng() === loc.lng
        )
    );
  };
  _findLocation = (loc: Pos, isWithPlaces?: boolean) => {
    const arr =
      (isWithPlaces && this.allLocs.concat(this.nearbyLocs)) || this.allLocs;
    return arr.find(el => el["lat"] === loc.lat && el["lng"] === loc.lng);
  };

  _changeMarkerName = (loc: Pos, marker?: google.maps.Marker) => {
    this.infoWindow.close();
    const isCurrent = Boolean(
      this.currentMarker.lat === loc.lat && this.currentMarker.lng === loc.lng
    );
    if (isCurrent) return;
    const m = this._findMarker(loc) || marker;
    const location = this._findLocation(loc, true);
    const name = (m && m["name"]) || (location && location["name"]);
    if (name) {
      this.infoWindow.setPosition(loc);
      this.infoWindow.setContent(name);
      this.infoWindow.open(this.map, m);
      // console.log("change", name);
    }
  };

  _markerHandler = (
    event: google.maps.MouseEvent,
    marker: google.maps.Marker
  ) => {
    const loc = {
      lat: +event.latLng.lat().toFixed(4),
      lng: +event.latLng.lng().toFixed(4)
    };
    //show modal
    this.handleChangeCurrentMarker(loc, marker);
    this.cdr.detectChanges(); //robot, do your work!
  };

  _markerModalHandler = () => {
    //show modal
    this.handleToggleModal();
  };

  _mapCenter = (lat: number, lng: number) => {
    return new google.maps.LatLng(lat, lng);
  };

  /**
   *
   * @param location to set marker
   * @param gMarker to add places icon
   */
  _placeMarker = (location: Pos, gMarker?: any) => {
    const loc = {
      lat: +location.lat.toFixed(4),
      lng: +location.lng.toFixed(4)
    };
    // console.log("place marker", location);
    this.handleChangeCurrentMarker(loc);
    let marker;
    //add places icon
    if (gMarker && gMarker.icon) {
      const isExists = this._findMarker(loc);
      if (isExists) return;
      marker = new google.maps.Marker({
        position: loc,
        map: this.map,
        draggable: true,
        icon: {
          url: gMarker.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(20, 10),
          scaledSize: new google.maps.Size(40, 50)
        }
      });
      this.nearbyMarkers.push(marker);
    } else {
      const isExists = this._findMarker(loc);
      if (isExists) return;
      marker = new google.maps.Marker({
        position: location,
        map: this.map,
        draggable: true
      });
      this.markers.push(marker);
    }
    marker.addListener("click", (event: google.maps.MouseEvent) => {
      this._markerHandler(event, marker);
    });
    marker.addListener("dblclick", () => {
      this._markerModalHandler();
    });
    if (gMarker)
      this.handleAddLocation(
        {
          name: gMarker.name,
          type: gMarker.types[0] || gMarker.types,
          lat: loc.lat,
          lng: loc.lng,
          user_id: this.userService.currentUser["_id"]
        },
        true
      );
  };

  handleChangeCurrentMarker = (loc: Pos, marker?: google.maps.Marker) => {
    this._changeMarkerName(loc, marker);
    const element = this._findLocation(loc, true);
    if (element) this.handleToggleAction(false);
    else this.handleToggleAction(true);
    this.currentMarker = loc;
  };

  handleToggleAction = (add: boolean) => {
    return (this.isUpdate = add);
  };

  //add location to lists
  handleAddLocation = (location: Loc, isPlaces?: boolean) => {
    if (isPlaces) return this.nearbyLocs.push(location);
    this._changeMarkerName(location);
    this.newLocs.push(location);
    this.allLocs = this.defLocs.concat(this.newLocs);
  };

  //on location update
  handleUpdateLocation = (loc: Loc) => {
    // console.log("GO update", loc);
    const location = this._findLocation(loc);
    if (location)
      this.locationService.updateLocation(loc).subscribe(result => {
        this.handleRefreshLocations();
        console.log("result", result);
      });
    else console.log("hell with ya");
  };

  //on edit icon click
  handleEditLocation = (location: Loc) => {
    const loc = {
      lat: location.lat,
      lng: location.lng
    };
    const marker = this._findMarker(loc);
    this.handleToggleAction(false);
    this.handleChangeCurrentMarker(loc, marker);
    this.isModalShow = true;
  };

  //TODO: marker is not deleted after location is
  handleDeleteLocation = (location: Loc) => {
    console.log(location);
    if (!location["_id"]) {
      this._deleteLoc(location);
      return this.cdr.detectChanges(); //robot, do your work!
    }
    this.locationService.deleteLocation(location).subscribe(
      result => {
        this.allLocs = this.defLocs.concat(this.newLocs);
        this.handleRefreshLocations();
        this.cdr.detectChanges(); //robot, do your work!
      },
      err => console.log("No such place", err.message)
    );
  };

  handleSaveLocations = () => {
    this.locationService.saveCurrentLocations(this.allLocs).subscribe(
      added => {
        console.log("success", added);
        this.handleRefreshLocations();
      },
      e => console.info(e)
    );
  };

  handleToggleModal = () => {
    this.isModalShow = !this.isModalShow;
    this.cdr.detectChanges(); //robot, do your work!
  };
  handleToggleMarkers = () => {
    this.isMarkersVisible = !this.isMarkersVisible;
    if (this.isMarkersVisible) this.handleSetMapOnAll(this.map);
    else this.handleSetMapOnAll(null);
  };

  handleSetMapOnAll = (map: google.maps.Map) => {
    const array1 = this.markers;
    const array2 = this.nearbyMarkers;
    for (let i = 0; i < array1.length; i++) {
      array1[i].setMap(map);
    }
    for (let i = 0; i < array2.length; i++) {
      array2[i].setMap(map);
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
    service.nearbySearch(request, this.handleResolvePlaces);
  };
  handleResolvePlaces = (results, status) => {
    this.handleSetMapOnAll(null);
    this.nearbyLocs = [];
    this.nearbyMarkers = [];
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(el => {
        const place = el.geometry.location;
        this._placeMarker({ lat: place.lat(), lng: place.lng() }, el);
      });
    }
    this.handleSetMapOnAll(this.map);
    this.cdr.detectChanges(); //robot, do your work!
  };

  handleRefreshLocations = () => {
    const user = this.userService.currentUser;
    this.locationService.getUserLocations(user).subscribe(result => {
      const locs: object[] = result["locations"];
      this.handleSetMapOnAll(null);
      this.markers = [];
      this.defLocs = locs;
      locs.map(el => this._placeMarker({ lat: el["lat"], lng: el["lng"] }));
      this.allLocs = this.defLocs;
      this.handleSetMapOnAll(this.map);
    });
  };
  handleClear = () => {
    this.newLocs = [];
    this.nearbyMarkers = [];
    this.nearbyLocs = [];
    this.isModalShow = false;
    this.handleRefreshLocations();
    console.log(this.markers);
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
    //add marker on click
    this.map.addListener("click", (event: google.maps.MouseEvent) => {
      this._placeMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    });
    //add current location marker
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.pos.lat = +pos.coords.latitude.toFixed(4);
          this.pos.lng = +pos.coords.longitude.toFixed(4);
        },
        err => console.log("navigator get position error", err.message)
      );
      const current = this._findMarker(this.pos);
      if (!current) {
        console.log("add your position", this.pos);
        this.handleAddLocation(
          {
            name: "You are here",
            type: "here",
            lat: this.pos.lat,
            lng: this.pos.lng,
            user_id: this.userService.currentUser["_id"]
          },
          true
        );
        this._placeMarker(this.pos);
      }
      this.cdr.detectChanges(); //robot, do your work!
    }
  }

  // ngAfterContentChecked() {
  //   console.log("this.allLocs", this.allLocs);
  // }
}
