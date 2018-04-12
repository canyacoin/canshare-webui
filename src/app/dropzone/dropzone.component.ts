import { Component, OnInit } from '@angular/core';

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

  constructor() { }

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
    return;

    // let reader = new FileReader();

    // let content;

    // reader.onload = ((theFile, comp) => {
    //   return (e) => {
    //     content = JSON.parse(e.target.result);
    //     content = JSON.parse(content);
    //   };
    // })(file, this);

    // reader.readAsText(file);
  }

}
