import { Component, OnInit, ViewChild, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { IpfsService } from '../@services/ipfs.service';
import { LocalStorageService } from '../@services/local-storage.service';
import { FileComponent } from '../file/file.component';
import { InfoService } from '../@services/info.service';

declare var require: any;

const filesize = require('filesize');

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
    private ls: LocalStorageService,
    public info: InfoService) {

    ls.init();

    ipfs.onFileAdded.subscribe(data => {
      this.hasNoFiles = false;
      this.listFile(data);
    });

    ipfs.onFileUpload.subscribe(data => {
      this.fileComponents[data.index].instance.pctg = data.pctg;
    });

    ipfs.onFileUploadEnd.subscribe(({ ipfsFile, fileObj }) => {
      let fileComponent = this.fileComponents[fileObj.index].instance;

      let fileExists = this.ls.getFile(ipfsFile.hash);
      if (fileExists) {
        this.fileComponents[fileObj.index].destroy();
        delete this.fileComponents[fileObj.index];
        return false;
      }

      fileComponent.ipfsHash = ipfsFile.hash;
      fileComponent.renderIpfsLink();
      fileComponent.isUploading = false;

      this.storeFile({ipfsFile, fileObj});
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

      let fileComponent = this.fileComponents[this.ipfs.fileCount].instance;
      fileComponent.ipfsHash = fileObj.hash;
      fileComponent.pctg = '100%';
      fileComponent.renderIpfsLink();
      fileComponent.isUploading = false;
    });
  }

  storeFile({ ipfsFile, fileObj }) {
    let files = this.ls.getFiles();

    files[ipfsFile.hash] = {
      index: fileObj.index,
      hash: ipfsFile.hash,
      path: ipfsFile.path,
      size: ipfsFile.size,
      name: fileObj.name,
      type: fileObj.type,
      pctg: '100%',
    }

    this.ls.store({ files });
  }

  listFile(data) {
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(FileComponent);

    let file = this.container.createComponent(factory);

    file.instance.index = data.index;

    file.instance.name = data.name;

    file.instance.size = filesize(data.size);

    file.instance.pctg = '0%';

    this.fileComponents.push(file);
  }

}
