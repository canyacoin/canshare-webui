import { Component, OnInit, ViewChild, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { IpfsService } from '../@services/ipfs.service';
import { LocalStorageService } from '../@services/local-storage.service';
import { FileComponent } from '../file/file.component';
import { InfoService } from '../@services/info.service';

declare var require: any;
declare var window: any;
declare var document: any;

const filesize = require('filesize');
const _ = require('lodash');

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.css']
})

export class FilesListComponent implements OnInit {

  @ViewChild("filesList", { read: ViewContainerRef }) container

  fileComponents: Array<any> = []

  hasNoFiles: boolean = false

  filesListAction: string

  uploadEnded: boolean = false

  constructor(
    private ipfs: IpfsService,
    private resolver: ComponentFactoryResolver,
    private ls: LocalStorageService,
    public info: InfoService) {

    ls.init();

    info.onRemoveFiles.subscribe(filesIndexes => {
      let files = ls.getFiles();

      filesIndexes.forEach(index => {
        _.remove(this.fileComponents, comp => {
          console.log(index, comp.instance.ipfsHash)
          if (comp.instance.ipfsHash == index) {
            window.$(comp.location.nativeElement).find('[data-toggle="tooltip"]').tooltip('dispose')
            delete files[comp.instance.ipfsHash];
            comp.destroy();
          }

          return comp.instance.index == index;
        });
      });

      ls.store({ files });
    });

    info.onDeselectAll.subscribe(filesIndexes => {
      this.fileComponents.forEach(comp => {
        comp.instance.isSelected = false;
      });
    });

    ipfs.onFileAdded.subscribe(data => {
      this.hasNoFiles = false
      this.uploadEnded = false
      this.listFile(data)
    });

    ipfs.onFileUpload.subscribe(data => {
      this.fileComponents[data.index].instance.pctg = data.pctg;
    });

    ipfs.onStreamEnd.subscribe(data => {
      this.fileComponents[data.index].instance.streamEnded = true
    })

    ipfs.onFileUploadEnd.subscribe(({ ipfsFile, fileObj }) => {
      if (this.uploadEnded) return false

      let fileComponent = this.fileComponents[fileObj.index].instance;

      let fileExists = this.ls.getFile(ipfsFile.hash);
      if (fileExists) {
        this.fileComponents[fileObj.index].destroy();
        delete this.fileComponents[fileObj.index];
        return false;
      }

      fileComponent.ipfsHash = ipfsFile.hash
      fileComponent.renderIpfsLink()
      fileComponent.isUploading = false
      fileComponent.streamEnded = false

      this.uploadEnded = true
      this.storeFile({ipfsFile, fileObj})
    });
  }

  ngAfterViewInit(){
    const ESC_KEY = 27;
    window.onkeyup = event => {
      if (event.keyCode == ESC_KEY) {
        this.info.deselectAll();
      }
    }
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

  applyAction(action: string){
    if (this.info.selectedFiles.length <= 0) return false;

    if (action === 'share-multiple-files') {
      console.log('share');
      this.info.displayShareFileByEmailModal(this.info.selectedFiles);
    }

    if (action === 'remove-multiple-files') {
      console.log('remove');
      this.info.removeFiles(this.info.selectedFiles);
    }
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
