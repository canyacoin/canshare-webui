import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InfoService } from './@services/info.service';
import { LocalStorageService } from './@services/local-storage.service';
import { IpfsService } from './@services/ipfs.service';

declare var BancorConvertWidget: any;
declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';

  constructor(public info: InfoService){}

  ngOnInit(){
  }

  ngAfterViewInit() {
    BancorConvertWidget.init({
      'type': '1',
      'baseCurrencyId': '5a6f61ece3de16000123763a',
      'pairCurrencyId': '5937d635231e97001f744267',
      'primaryColor': '#00BFFF',
      'primaryColorHover': '55DAFB'
    });

    window.$('[data-toggle="tooltip"]').tooltip();
  }
}
