import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";

const mockLocations = [
  {
    name: "somewhere",
    type: "restaurant",
    lat: 46.4598865,
    lng: 30.5717048
  },
  {
    name: "anywhere",
    type: "park",
    lat: 46.4599865,
    lng: 30.5718048
  },
  {
    name: "elsewhere",
    type: "beach",
    lat: 46.460865,
    lng: 30.5719048
  },
  {
    name: "softwhere",
    type: "restaurant",
    lat: 46.460165,
    lng: 30.5720048
  }
];

@Component({
  selector: "app-locations",
  templateUrl: "./locations.component.html",
  styleUrls: ["./locations.component.css"]
})
export class LocationsComponent implements OnInit {
  locations: Object[] = mockLocations;

  newLocations: Object[] = []

  showText: string = "Hide";
  constructor(private userService: UserService) {}
  handleSaveLocations() {}
  handleDiscardChanges() {}

  handleToggleShow() {
    const { showText } = this;
    if (showText === "Hide") this.showText = "Show";
    else this.showText = "Hide";
  }
  handleEdit(loc){
    console.log("edit location",loc)
  }
  ngOnInit() {
    const user = this.userService.currentUser;

    // this.userService.getUserLocations(user).subscribe(locations => {
    //   console.log('locations fetched', locations)
    // })
  }
}
