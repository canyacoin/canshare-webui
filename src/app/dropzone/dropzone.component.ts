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

  constructor(private ipfs: IpfsService) {}

  ngOnInit() {
  }

  onUploadError($evt) {
    console.log($evt);
  }

  onUploadSuccess($evt) {
    console.log($evt);
  }

  onFileAdded(file, $evt?) {
    console.log(file);

    let reader = new FileReader();

    let content;

    reader.onload = ((theFile, comp) => {
      return (e) => {
        // console.log(e);
        comp.ipfs.fileCount++;
        let f = {
          index: comp.ipfs.fileCount,
          name: theFile.name,
          type: theFile.type,
          size: theFile.size,
          progress: 0,
        };
        comp.ipfs.files.push(f);
        comp.ipfs.onFileAdded.next(f);
        comp.ipfs.upload(e.target.result, f);
      };
    })(file, this);

    reader.readAsText(file);
  }

}
