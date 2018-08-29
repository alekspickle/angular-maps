import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { UserService } from "../user.service";
import { LocationService } from "../location.service";

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
export class ModalComponent implements OnInit {
  @Output()
  onToggleModal = new EventEmitter();
  @Output()
  onEdit = new EventEmitter();
  @Input()
  marker;
  title = `Add new Location`;
  types = [
    { name: "park" },
    { name: "restaurant" },
    { name: "sea" },
    { name: "beach" },
    { name: "market" },
    { name: "street" }
  ];
  model: Loc = {
    name: "",
    type: "",
    lat: 0,
    lng: 0,
    user_id: this.userService.currentUser['_id']
  };

  constructor(
    private userService: UserService,
    private locationService: LocationService
  ) {}
  handleEditLocation() {
    this.onEdit.emit({
      ...this.model,
      lat: this.marker.lat,
      lng: this.marker.lng
    });
    this.onToggleModal.emit();
  }

  ngOnInit() {}
}
