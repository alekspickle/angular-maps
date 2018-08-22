import { Component, OnInit, OnChanges, AfterContentChecked } from "@angular/core";
import { UserService } from "../user.service";
import { LocationService } from "../location.service";

@Component({
  selector: "app-locations",
  templateUrl: "./locations.component.html",
  styleUrls: ["./locations.component.css"]
})
export class LocationsComponent implements OnInit, AfterContentChecked {
  allLocs: Object[] = [];
  showText: string = "Hide";
  constructor(
    private userService: UserService,
    private locationService: LocationService
  ) {}

  handleSaveLocations() {
    this.locationService
      .saveCurrentLocations(this.locationService.newLocs)
      .subscribe(added => {
        console.log("success", added);
      });
  }

  handleDiscardChanges() {
    this.locationService.onClear();
  }

  handleToggleShow() {
    const { showText } = this;
    if (showText === "Hide") this.showText = "Show";
    else this.showText = "Hide";
    this.locationService.onToggleMarkers()
    // console.log('is markers showed', this.locationService.isMarkersVisible);
  }
  
  handleDelete(loc) {
    this.locationService.onDeleteLocation(loc);
  }

  ngOnInit() {
    const user = this.userService.currentUser;
    this.locationService.getUserLocations(user);
    this.allLocs = this.locationService.allLocs();
  }
  
  ngAfterContentChecked() { 
    this.allLocs = this.locationService.allLocs();
    // console.log("location list", this.allLocs);
  }
}
