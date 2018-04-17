import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Buffer } from 'buffer';

declare let require: any;

const streamBuffers = require('stream-buffers');
const IPFS = require('ipfs');
const node = new IPFS({
  repo: '../assets/ipfs'
});

@Injectable()
export class IpfsService {

  progress: number = 0

  fileCount: number = -1

  files: Array<any> = []


  onNodeReady: Subject<any> = new Subject<any>()

  onNodeStart: Subject<any> = new Subject<any>()


  onFileUpload: Subject<any> = new Subject<any>()

  onFileUploadEnd: Subject<any> = new Subject<any>()

  onFileAdded: Subject<any> = new Subject<any>()


  fileProgressPerimeter: number = 131.95

  constructor() {
    node.on('ready', () => {
      console.log('Online status: ', node.isOnline() ? 'online' : 'offline');
      console.log(node);
      this.onNodeReady.next(node.isOnline());
    });
    node.on('error', error => {
      console.log(error);
    });
    node.on('init', () => {
      console.log('init IPFS');
    });
    node.on('start', () => {
      console.log('started IPFS');
    });
    node.on('stop', () => {
      console.log('stopped IPFS');
    });
  }

  upload(fileContent, fileObj) {
    this.progress = 0;

    let myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
      chunkSize: 25000
    });

    let stream = node.files.addReadableStream();

    stream.on('data', (ipfsFile) => {
      this.onFileUploadEnd.next({ ipfsFile, fileObj });

      console.log(node);
    });

    myReadableStreamBuffer.on('data', (chunk) => {
      this.progress += chunk.byteLength;

      let file = this.files[fileObj.index];
      file.progress += chunk.byteLength;
      file.pctg = (file.progress >= file.size) ?
        0 :
        this.fileProgressPerimeter - ((file.progress / file.size) * this.fileProgressPerimeter);

      this.onFileUpload.next(file);

      myReadableStreamBuffer.resume();
    });

    stream.write(myReadableStreamBuffer);

    myReadableStreamBuffer.put(Buffer.from(fileContent));
    myReadableStreamBuffer.stop();

    myReadableStreamBuffer.on('end', () => {
      console.log('END');
      stream.end();
    });

    myReadableStreamBuffer.resume();
  }

}
