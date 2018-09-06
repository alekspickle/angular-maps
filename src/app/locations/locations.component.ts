import {
  Component,
  OnInit,
  AfterContentChecked,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { UserService } from "../user.service";
import { LocationService } from "../location.service";

@Component({
  selector: "app-locations",
  templateUrl: "./locations.component.html",
  styleUrls: ["./locations.component.css"]
})
export class LocationsComponent implements AfterContentChecked {
  @Output()
  onDelete = new EventEmitter();
  @Output()
  onSave = new EventEmitter();
  @Output()
  onEdit = new EventEmitter();
  @Output()
  onClear = new EventEmitter();
  @Output()
  onToggleMarkers = new EventEmitter();
  @Input()
  parentLocs;
  @Input()
  isSearch;
  isWithoutButtons: boolean = false;
  allLocs: object[] = [];
  showText: string = "Hide";
  constructor(
    private userService: UserService,
    private locationService: LocationService
  ) {}

  handleSaveLocations = () => {
    this.onSave.emit();
  };

  handleDiscardChanges = () => {
    this.onClear.emit();
  };

  handleToggleShow = () => {
    if (this.showText === "Hide") this.showText = "Show";
    else this.showText = "Hide";

    this.onToggleMarkers.emit();
  };

  handleDelete = loc => {
    this.onDelete.emit(loc);
  };
  handleEdit = loc => {
    this.onEdit.emit(loc);
  };

  ngAfterContentChecked() {
    this.allLocs = this.parentLocs;
    this.isWithoutButtons = this.isSearch;
  }
}
