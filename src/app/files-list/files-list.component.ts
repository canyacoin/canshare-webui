import { Component, OnInit, ViewChild, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { IpfsService } from '../@services/ipfs.service';
import { FileComponent } from '../file/file.component';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.css']
})

export class FilesListComponent implements OnInit {

  @ViewChild("filesList", { read: ViewContainerRef }) container

  fileComponents: Array<any> = []

  constructor(
    private ipfs: IpfsService,
    private resolver: ComponentFactoryResolver) {

    ipfs.onFileAdded.subscribe(data => {
      this.listFile(data);
    });

    ipfs.onFileUpload.subscribe(data => {
      console.log(data);
      this.fileComponents[data.index].instance.pctg = data.pctg;
    });

    ipfs.onFileUploadEnd.subscribe((data) => {
      console.log(data);
      let file = this.fileComponents[data.fileObj.index].instance;
      file.ipfsHash = data.ipfsFile.hash;
      file.renderIpfsLink();
    });
  }

  ngOnInit() {
  }

  listFile(data) {
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(FileComponent);

    let file = this.container.createComponent(factory);

    file.instance.index = data.index;

    file.instance.name = data.name;

    file.instance.size = data.size;

    file.instance.pctg = this.ipfs.fileProgressPerimeter;

    this.fileComponents.push(file);
  }

}
