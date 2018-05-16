import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class InfoService {

  onAboutClick: Subject<any> = new Subject<any>()

  onShareByEmail: Subject<any> = new Subject<any>()

  onDeselectAll: Subject<any> = new Subject<any>()

  onRemoveFiles: Subject<any> = new Subject<any>()

  selectedFiles: Array<any> = []

  constructor() { }

  displayAboutModal(){
    this.onAboutClick.next({
      displayAboutModal: true,
      onAbout: true,
    });
  }

  deselectAll(){
    this.onDeselectAll.next(this.selectedFiles);
    this.selectedFiles = [];
  }

  selectFile(fileIndex: number){
    this.selectedFiles.push(fileIndex);
  }

  deselectFile(fileIndex: number){
    this.selectedFiles.splice(this.selectedFiles.indexOf(fileIndex), 1);
  }

  removeFiles(filesIndexes){
    this.onRemoveFiles.next(filesIndexes);
  }

  displayShareFileByEmailModal(filesIndexes){
    this.onShareByEmail.next({
      displayEmailModal: true,
      onBeforeSend: true,
      onSending: false,
      onAfterSend: false,
      filesIndexes: filesIndexes,
    });
  }

}
