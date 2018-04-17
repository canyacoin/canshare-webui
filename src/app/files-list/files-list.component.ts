import { Component, OnInit, ViewChild, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { IpfsService } from '../@services/ipfs.service';
import { LocalStorageService } from '../@services/local-storage.service';
import { FileComponent } from '../file/file.component';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.css']
})

export class FilesListComponent implements OnInit {

  @ViewChild("filesList", { read: ViewContainerRef }) container

  fileComponents: Array<any> = []

  hasNoFiles: boolean = false

  constructor(
    private ipfs: IpfsService,
    private resolver: ComponentFactoryResolver,
    private ls: LocalStorageService) {

    ls.init();

    ipfs.onFileAdded.subscribe(data => {
      this.hasNoFiles = false;
      this.listFile(data);
    });

    ipfs.onFileUpload.subscribe(data => {
      this.fileComponents[data.index].instance.pctg = data.pctg;
    });

    ipfs.onFileUploadEnd.subscribe((data) => {
      console.log(data);
      let file = this.fileComponents[data.fileObj.index].instance;
      file.ipfsHash = data.ipfsFile.hash;
      file.renderIpfsLink();

      this.storeFile(data);
    });
  }

  ngOnInit() {
    let files = this.ls.getFiles();

    if (Object.keys(files).length == 0) {
      this.hasNoFiles = true;
      return null;
    }

    Object.keys(files).forEach(key => {
      this.ipfs.fileCount++;

      let fileObj = files[key];
      this.listFile(fileObj);

      let fileComp = this.fileComponents[this.ipfs.fileCount].instance;
      fileComp.ipfsHash = fileObj.hash;
      fileComp.pctg = 0;
      fileComp.renderIpfsLink();
    });
  }

  storeFile({ ipfsFile, fileObj }) {
    let files = this.ls.getFiles();

    files[ipfsFile.hash] = {
      hash: ipfsFile.hash,
      path: ipfsFile.path,
      size: ipfsFile.size,
      name: fileObj.name,
      type: fileObj.type,
      pctg: 0,
    }

    this.ls.store({ files });
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
