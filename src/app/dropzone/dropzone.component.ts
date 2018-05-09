import { Component, OnInit, NgZone } from '@angular/core';
import { IpfsService } from '../@services/ipfs.service';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.css']
})

export class DropzoneComponent implements OnInit {

  dzMessage: string = `
    <i class="fa fa-cloud-upload-alt"></i>
    <h4>Drag a file to upload</h4>
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
  }

  onUploadError($evt) {
    console.log($evt);
  }

  onUploadSuccess(file, $evt) {
    console.log(file, $evt);
  }

  onFileAdded(file, $evt?) {
    console.log(file);

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
      this.ipfs.upload(reader.result, fileObj);
    }

    reader.readAsArrayBuffer(file);
  }

}
