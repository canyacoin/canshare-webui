import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Buffer } from 'buffer';

declare let require: any;

const streamBuffers = require('stream-buffers');
const IPFS = require('ipfs');
const node = new IPFS({
  repo: 'assets/ipfs'
});

@Injectable()
export class IpfsService {

  progress: number = 0

  files: Array<any> = []

  onFileUpload: Subject<any> = new Subject<any>()

  constructor() {
    node.on('ready', () => {
      console.log('Online status: ', node.isOnline() ? 'online' : 'offline');
      console.log(node);
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

  upload(fileObj) {
    this.progress = 0;

    let myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
      chunkSize: 25000
    });

    let stream = node.files.addReadableStream();

    stream.on('data', (file) => {
      console.log(file);
    });

    myReadableStreamBuffer.on('data', (chunk) => {
      console.log(chunk);
      this.progress += chunk.byteLength;

      myReadableStreamBuffer.resume();
    });

    stream.write(myReadableStreamBuffer);

    myReadableStreamBuffer.put(Buffer.from(fileObj));
    myReadableStreamBuffer.stop();

    myReadableStreamBuffer.on('end', () => {
      console.log('END');
      stream.end();
    });

    myReadableStreamBuffer.resume();
  }

}
