import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Buffer } from 'buffer';

declare let require: any;

const streamBuffers = require('stream-buffers');
const IPFS = require('ipfs');
const node = new IPFS({
  repo: '../assets/ipfs',
});

@Injectable()
export class IpfsService {

  node: any

  fileCount: number = -1

  files: Array<any> = []


  fileIsUploading: boolean = false

  nodeIsReady: boolean = false

  onNodeReady: Subject<any> = new Subject<any>()

  onNodeStart: Subject<any> = new Subject<any>()


  onFileUpload: Subject<any> = new Subject<any>()

  onFileUploadEnd: Subject<any> = new Subject<any>()

  onFileAdded: Subject<any> = new Subject<any>()


  fileProgressPerimeter: number = 135.95

  constructor() {
    this.node = node;

    node.on('ready', () => {
      console.log('Online status: ', node.isOnline() ? 'online' : 'offline');
      console.log(node);
      this.onNodeReady.next(node.isOnline());
      this.nodeIsReady = node.isOnline();
    });
    node.on('error', error => {
      console.log(error);
    });
    node.on('init', () => {
      console.log('init IPFS');
    });
    node.on('start', () => {
      console.log('started IPFS');
      console.log('Online status: ', node.isOnline() ? 'online' : 'offline');
    });
    node.on('stop', () => {
      console.log('stopped IPFS');
      console.log('Online status: ', node.isOnline() ? 'online' : 'offline');
    });
  }

  start(){
    if (!this.nodeIsReady) return;

    if (this.node.isOnline()) return;

    this.node.start();
  }

  stop(){
    if (this.node && this.node.isOnline()) {
      this.node.stop();
    }
  }

  queue(fileContent, fileObj){
    this.files.push({ fileContent, fileObj });

    if (this.fileIsUploading) return false;

    this.upload(this.files.shift());
  }

  upload({fileContent, fileObj}) {
    this.fileIsUploading = true;

    let myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
      chunkSize: 25000
    });

    let stream = node.files.addReadableStream();

    stream.on('data', (ipfsFile) => {
      this.onFileUploadEnd.next({ ipfsFile, fileObj });
    });

    myReadableStreamBuffer.on('data', (chunk) => {
      fileObj.progress += chunk.byteLength;
      fileObj.pctg = (fileObj.progress >= fileObj.size) ? '100%' : `${(fileObj.progress / fileObj.size) * 100}%`;

      this.onFileUpload.next(fileObj);

      myReadableStreamBuffer.resume();
    });

    stream.write(myReadableStreamBuffer);

    myReadableStreamBuffer.put(Buffer.from(fileContent));
    myReadableStreamBuffer.stop();

    myReadableStreamBuffer.on('end', () => {
      stream.end();

      setTimeout(() => {
        if (this.files.length <= 0) {
          this.fileIsUploading = false;
          console.log('END');
          return false;
        }

        this.upload(this.files.shift());
      }, 2000);
    });

    myReadableStreamBuffer.resume();
  }

}
