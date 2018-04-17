import { Component, OnInit } from '@angular/core';
import { IpfsService } from '../@services/ipfs.service';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.css']
})

export class DropzoneComponent implements OnInit {

  dzMessage: string = `
    <i class="fa fa-cloud-upload-alt"></i>
    <h4>Drag files to upload</h4>
    <p>- or -</p>
    <span class="btn btn-primary">Browse</span>
  `

  loadingMessages: Array<string> = [
    'CANShare lets you upload files of any size of any type.',
    'Files are uploaded permanently to the Interplanetary File System, IPFS',
    'After a file is uploaded, copy the IPFS link to share it'
  ]

  loadingMessage: string

  load: boolean = true

  nodeIsReady: boolean = false

  overlayMessageClass: string = ''

  overlayClass: string = ''

  constructor(private ipfs: IpfsService) {
    ipfs.onNodeReady.subscribe(isReady => {
      this.nodeIsReady = isReady;
    });
  }

  ngOnInit() {
    this.getNextMessage(0);
  }

  getNextMessage(i) {
    if (this.nodeIsReady && i >= this.loadingMessages.length) {
      this.load = false;
      return;
    }

    this.loadingMessage = this.loadingMessages[i];

    setTimeout(() => {
      this.getNextMessage(++i);
    }, 5000);
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
      let f = {
        index: this.ipfs.fileCount,
        name: file.name,
        type: file.type,
        size: file.size,
        progress: 0,
      };
      this.ipfs.files.push(f);
      this.ipfs.onFileAdded.next(f);
      this.ipfs.upload(reader.result, f);
    }

    reader.readAsArrayBuffer(file);
  }

}
