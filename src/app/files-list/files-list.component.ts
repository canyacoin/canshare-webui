import { Component, OnInit } from '@angular/core';
import { IpfsService } from '../@services/ipfs.service';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.css']
})
export class FilesListComponent implements OnInit {

  constructor(private ipfs: IpfsService) {
    ipfs.onFileUpload.subscribe(data => {
      console.log(data);
    });
  }

  ngOnInit() {
  }

}
