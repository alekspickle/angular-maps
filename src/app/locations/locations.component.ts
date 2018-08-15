import { Component, OnInit, AfterContentChecked } from "@angular/core";
import { UserService } from "../user.service";
import { LocationService } from "../location.service";

@Component({
  selector: "app-locations",
  templateUrl: "./locations.component.html",
  styleUrls: ["./locations.component.css"]
})
export class LocationsComponent implements OnInit, AfterContentChecked {
  allLocs: Object[] = []
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
    this.locationService.onClear()
  }

  handleToggleShow() {
    const { showText } = this;
    if (showText === "Hide") this.showText = "Show";
    else this.showText = "Hide";
  }

  handleDelete(loc) {
    console.log("delete location", loc);
  }

  ngOnInit() {
    const user = this.userService.currentUser;
    this.allLocs = this.locationService.allLocs;
    this.locationService.getUserLocations(user)
    console.log('location list',this.allLocs)
  }

  ngAfterContentChecked(){
    this.allLocs = this.locationService.allLocs;
  }
}
