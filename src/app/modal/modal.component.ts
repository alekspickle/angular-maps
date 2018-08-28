import { Component, OnInit, Input } from "@angular/core";
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
  @Input() onToggleModal
  @Input() handleAdd
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
    user_id: ""
  };

  constructor(
    private userData: UserService,
    private locationService: LocationService
  ) {}
  handleAddLocation(e) {
    console.log("event", e);

    this.handleAdd(this.model)
    this.onToggleModal()
  }

  ngOnInit() {}
}
