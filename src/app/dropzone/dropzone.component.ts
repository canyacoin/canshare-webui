import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { IpfsService } from '../@services/ipfs.service';
import { DropzoneComponent as Dropzone } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.css']
})

export class DropzoneComponent implements OnInit {

  @ViewChild(Dropzone) dropzone: Dropzone;

  dzMessage: string = `
    <i class="fa fa-cloud-upload-alt"></i>
    <h4>Drag files to upload</h4>
    <p>- or -</p>
    <span class="btn btn-primary">Browse</span>
  `

  loadingMessage: string

  load: boolean = true

  nodeIsReady: boolean = false

  status: string = 'IPFS is offline'

  overlayMessageClass: string = ''

  overlayClass: string = ''

  constructor(
    private ipfs: IpfsService,
    private zone: NgZone) {
    ipfs.onNodeReady.subscribe(isReady => {
      this.nodeIsReady = isReady;
      this.status = isReady ? 'IPFS is connected' : 'IPFS is offline';

      zone.run(ran => console.log('updated zone'));
    });
  }

  ngOnInit() {
    this.ipfs.onNodeReady.next(true);
  }

  onUploadError($evt) {
    console.log($evt);
  }

  onUploadSuccess(file) {
    console.log(file);
  }

  onFileAdded(file) {
    let reader = new FileReader();

    reader.onloadend = () => {
      this.ipfs.fileCount++;
      let fileObj = {
        index: this.ipfs.fileCount,
        name: file.name,
        type: file.type,
        size: file.size,
        progress: 0,
      };
      this.ipfs.onFileAdded.next(fileObj);
      this.ipfs.queue(reader.result, fileObj);
    }

    reader.readAsArrayBuffer(file);
  }

}
