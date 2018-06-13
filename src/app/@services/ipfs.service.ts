import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Buffer } from 'buffer';

declare let require: any;

const streamBuffers = require('stream-buffers');

const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https'});

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

  onStreamEnd: Subject<any> = new Subject<any>()


  gatewayURL: string = 'https://ipfs.infura.io/ipfs'


  fileProgressPerimeter: number = 135.95

  constructor() {}

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

    let stream = ipfs.addReadableStream();

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
      this.onStreamEnd.next(fileObj)

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
