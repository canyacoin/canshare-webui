import { Component, OnInit } from '@angular/core';
import { InfoService } from '../@services/info.service';

@Component({
  selector: 'app-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.css']
})
export class AboutModalComponent implements OnInit {

  display: boolean = false

  onAbout: boolean = false

  constructor(public info: InfoService) {
    info.onAboutClick.subscribe(data => {
      this.display = data.displayAboutModal;
      this.onAbout = data.onAbout;
    });
  }

  ngOnInit() {
  }

}
