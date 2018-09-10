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
  _id: number;
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
  private gmapElement: any;
  private search: Search = {
    radius: 0,
    type: ""
  };
  private currentMarker: Pos = {
    lat: 46.473,
    lng: 30.7412
  };
  private types: object[] = types;
  private defLocs: Loc[] = [];
  private newLocs: Loc[] = [];
  private allLocs: Loc[] = this.defLocs.concat(this.newLocs);
  private markers: google.maps.Marker[] = [];
  private nearbyMarkers: google.maps.Marker[] = [];
  private infoWindow: google.maps.InfoWindow = new google.maps.InfoWindow();
  private pos: Pos = Object.assign(this.currentMarker);
  private map: any;
  private nearbyLocs: Loc[] = [];

  public isUpdate: boolean = false;
  public isModalShow: boolean = false;
  public isMarkersVisible: boolean = true;

  constructor(
    private userService: UserService,
    private locationService: LocationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  private deleteLoc(location: Loc) {
    this.newLocs = this.newLocs.filter(
      el => location.lat !== el.lat && location.lng !== el.lng
    );
    this.allLocs = this.allLocs.filter(
      el => location.lat !== el.lat && location.lng !== el.lng
    );
    this.markers = this.markers.filter(
      el =>
        location.lat !== el.getPosition().lat() &&
        location.lng !== el.getPosition().lng()
    );
    this.handleRefreshLocations();
  }
  private findMarker = (location: Pos) => {
    return (
      this.markers.length &&
      this.markers
        .concat(this.nearbyMarkers)
        .find(
          el =>
            el.getPosition().lat() === location.lat &&
            el.getPosition().lng() === location.lng
        )
    );
  };
  private findLocation = (location: Pos, isWithPlaces?: boolean) => {
    const arr: Loc[] =
      (isWithPlaces && this.allLocs.concat(this.nearbyLocs)) || this.allLocs;
    return arr.find(el => el.lat === location.lat && el.lng === location.lng);
  };

  private changeMarkerName = (position: Pos, marker?: google.maps.Marker) => {
    this.infoWindow.close();
    const isCurrent = Boolean(
      this.currentMarker.lat === position.lat &&
        this.currentMarker.lng === position.lng
    );
    if (isCurrent) return;
    const m = this.findMarker(position) || marker;
    const location = this.findLocation(position, true);
    const name = location && location["name"];
    if (name) {
      this.infoWindow.setPosition(location);
      this.infoWindow.setContent(name);
      this.infoWindow.open(this.map, m);
    }
  };

  private markerHandler = (
    event: google.maps.MouseEvent,
    marker: google.maps.Marker
  ) => {
    const location = {
      lat: +event.latLng.lat().toFixed(4),
      lng: +event.latLng.lng().toFixed(4)
    };
    //show modal
    this.handleChangeCurrentMarker(location, marker);
    this.cdr.detectChanges(); //robot, do your work!
  };

  private markerModalHandler = () => {
    //show modal
    this.handleToggleModal();
  };

  private mapCenter = (lat: number, lng: number) => {
    return new google.maps.LatLng(lat, lng);
  };

  /**
   *
   * @param location to set marker
   * @param gMarker to add places icon
   */
  private placeMarker = (position: Pos, gMarker?: any) => {
    const location = {
      lat: +position.lat.toFixed(4),
      lng: +position.lng.toFixed(4)
    };
    this.handleChangeCurrentMarker(location);
    let marker;
    //add places icon
    if (gMarker && gMarker.icon) {
      const isExists = this.findMarker(location);
      if (isExists) return;
      marker = new google.maps.Marker({
        position: location,
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
      const isExists = this.findMarker(location);
      if (isExists) return;
      marker = new google.maps.Marker({
        position: location,
        map: this.map,
        draggable: true
      });
      this.markers.push(marker);
    }
    marker.addListener("click", (event: google.maps.MouseEvent) => {
      this.markerHandler(event, marker);
    });
    marker.addListener("dblclick", () => {
      this.markerModalHandler();
    });
    if (gMarker)
      this.handleAddLocation(
        {
          _id: Date.now(),
          name: gMarker.name,
          type: gMarker.types[0] || gMarker.types,
          lat: location.lat,
          lng: location.lng,
          user_id: this.userService.currentUser._id
        },
        true
      );
  };

  handleChangeCurrentMarker = (location: Pos, marker?: google.maps.Marker) => {
    this.changeMarkerName(location, marker);
    const element = this.findLocation(location, true);
    if (element) this.handleToggleAction(false);
    else this.handleToggleAction(true);
    this.currentMarker = location;
  };

  handleToggleAction = (add: boolean) => {
    return (this.isUpdate = add);
  };

  //add location to lists
  handleAddLocation = (location: Loc, isPlaces?: boolean) => {
    if (isPlaces) return this.nearbyLocs.push(location);
    this.changeMarkerName(location);
    this.newLocs.push(location);
    this.allLocs = this.defLocs.concat(this.newLocs);
  };

  //on location update
  handleUpdateLocation = (editable: Loc) => {
    const location = this.findLocation(editable);
    if (location)
      this.locationService.updateLocation(location).subscribe(result => {
        this.handleRefreshLocations();
      });
    else console.log("hell with ya");
  };

  //on edit icon click
  handleEditLocation = (editable: Loc) => {
    const location = {
      lat: editable.lat,
      lng: editable.lng
    };
    const marker = this.findMarker(location);
    this.handleToggleAction(false);
    this.handleChangeCurrentMarker(location, marker);
    this.isModalShow = true;
  };

  //TODO: marker is not deleted after location is
  handleDeleteLocation = (location: Loc) => {
    if (!location["_id"]) {
      this.deleteLoc(location);
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
        this.placeMarker({ lat: place.lat(), lng: place.lng() }, el);
      });
    }
    this.handleSetMapOnAll(this.map);
    this.cdr.detectChanges(); //robot, do your work!
  };

  handleRefreshLocations = () => {
    const user = this.userService.currentUser;
    this.locationService.getUserLocations(user).subscribe(result => {
      const locs: Loc[] = result["locations"];
      this.handleSetMapOnAll(null);
      this.markers = [];
      this.defLocs = locs;
      locs.map(el => this.placeMarker({ lat: el["lat"], lng: el["lng"] }));
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
  };

  ngOnInit() {
    if (!this.userService.isAuthorized) this.router.navigate(["/login"]);
    this.handleRefreshLocations();
    //init map
    this.map = new google.maps.Map(this.gmapElement.nativeElement, {
      zoom: 11,
      zoomControl: true,
      streetViewControl: true,
      center: this.mapCenter(this.pos.lat, this.pos.lng)
    });
    //add marker on click
    this.map.addListener("click", (event: google.maps.MouseEvent) => {
      this.placeMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() });
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
      const current = this.findMarker(this.pos);
      if (!current) {
        console.log("add your position", this.pos);
        this.handleAddLocation(
          {
            _id: Date.now(),
            name: "You are here",
            type: "here",
            lat: this.pos.lat,
            lng: this.pos.lng,
            user_id: this.userService.currentUser["_id"]
          },
          true
        );
        this.placeMarker(this.pos);
      }
      this.cdr.detectChanges(); //robot, do your work!
    }
  }
}
