import {
  Component,
  OnInit,
  OnChanges,
  AfterContentChecked,
  Input
} from "@angular/core";
import { UserService } from "../user.service";
import { LocationService } from "../location.service";

@Component({
  selector: "app-locations",
  templateUrl: "./locations.component.html",
  styleUrls: ["./locations.component.css"]
})
export class LocationsComponent implements OnInit, AfterContentChecked {
  @Input()
  isModalShow: boolean;
  @Input()
  onClear;
  @Input()
  onDeleteLocation;
  @Input()
  onToggleMarkers;
  @Input()
  parentLocs;
  allLocs: Object[] = [];
  showText: string = "Hide";
  constructor(
    private userService: UserService,
    private locationService: LocationService
  ) {}

  handleSaveLocations() {
    this.locationService.saveCurrentLocations(this.allLocs).subscribe(added => {
      console.log("success", added);
    });
  }

  handleDiscardChanges() {
    this.onClear();
  }

  handleToggleShow() {
    const { showText } = this;
    if (showText === "Hide") this.showText = "Show";
    else this.showText = "Hide";
    this.onToggleMarkers();
    // console.log('is markers showed', this.locationService.isMarkersVisible);
  }

  handleDelete(loc) {
    this.onDeleteLocation(loc);
  }

  ngOnInit() {
    this.allLocs = this.parentLocs;
  }

  ngAfterContentChecked() {
    this.allLocs = this.parentLocs;
    // console.log("location list", this.allLocs);
  }
}
