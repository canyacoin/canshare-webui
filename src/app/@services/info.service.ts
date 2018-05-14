import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class InfoService {

  onAboutClick: Subject<any> = new Subject<any>()

  onShareByEmail: Subject<any> = new Subject<any>()

  constructor() { }

  displayAboutModal(){
    this.onAboutClick.next({
      displayAboutModal: true,
      onAbout: true,
    });
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
