import {
  Component,
  Input,
  EventEmitter,
  Output,
  AfterContentChecked
} from "@angular/core";
import { UserService } from "../user.service";
import { LocationService } from "../location.service";
import { types } from ".././constants/locations";

type Loc = {
  name: string;
  type: string;
  lat: number;
  lng: number;
  user_id: string;
};

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"]
})
export class ModalComponent implements AfterContentChecked {
  @Output()
  onToggleModal = new EventEmitter();
  @Output()
  onEdit = new EventEmitter();
  @Output()
  onUpdate = new EventEmitter();
  @Input()
  marker;
  @Input()
  isModalUpdate: boolean;
  isUpdate: boolean = false;
  label: string = "Add";
  types: object[] = types;

  model: Loc = {
    name: "",
    type: "",
    lat: 0,
    lng: 0,
    user_id: this.userService.currentUser["_id"]
  };

  constructor(
    private userService: UserService,
    private locationService: LocationService
  ) {}
  handleUpdateLocation = () => {
    this.onEdit.emit({
      ...this.model,
      lat: this.marker.lat,
      lng: this.marker.lng
    });
    this.onToggleModal.emit();
  };
  handleEditLocation = () => {
    this.onEdit.emit({
      ...this.model,
      lat: this.marker.lat,
      lng: this.marker.lng
    });
    this.onToggleModal.emit();
  };

  ngAfterContentChecked() {
    this.isUpdate = this.isModalUpdate;
    this.label = this.isUpdate && "Add" || "Edit"
  }
}
