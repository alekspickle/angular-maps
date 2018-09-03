import { Component, Input, EventEmitter, Output } from "@angular/core";
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
export class ModalComponent {
  @Output()
  onToggleModal = new EventEmitter();
  @Output()
  onEdit = new EventEmitter();
  @Input()
  marker;
  @Input()
  action: string;
  title = `${this.action || "Add"} location`;
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
  handleEditLocation = () => {
    this.onEdit.emit({
      ...this.model,
      lat: this.marker.lat,
      lng: this.marker.lng
    });
    this.onToggleModal.emit();
  };
}
