import { Component, OnInit, AfterContentChecked } from "@angular/core";
import { UserService } from "../user.service";
import { LocationService } from "../location.service";

@Component({
  selector: "app-locations",
  templateUrl: "./locations.component.html",
  styleUrls: ["./locations.component.css"]
})
export class LocationsComponent implements OnInit, AfterContentChecked {
  locations: Object[];

  newLocations: Object[] = [];

  showText: string = "Hide";
  constructor(
    private userService: UserService,
    private locationService: LocationService
  ) {}
  handleSaveLocations() {
    this.locationService
      .saveCurrentLocations(this.newLocations)
      .subscribe(locations => {
        console.log("new locations", locations);
      });
  }
  handleDiscardChanges() {
    this.newLocations = []
  }

  handleToggleShow() {
    const { showText } = this;
    if (showText === "Hide") this.showText = "Show";
    else this.showText = "Hide";
  }
  handleEdit(loc) {
    console.log("edit location", loc);
  }
  ngOnInit() {
    const user = this.userService.currentUser;
    this.locations = this.locationService.locations;
    this.locationService.getUserLocations(user).subscribe(locations => {
      console.log("locations fetched", locations);
    });
  }
  ngAfterContentChecked(){
    console.log(this.locationService.locations === this.locations)
  }
}
