import { Component, OnInit } from '@angular/core';
import { nothing } from ".././constants/locations";

@Component({
  selector: 'app-about-author',
  templateUrl: './about-author.component.html',
  styleUrls: ['./about-author.component.css']
})
export class AboutAuthorComponent implements OnInit {
  nothing: string[] = nothing

  constructor() { }

  ngOnInit() {
  }

}
