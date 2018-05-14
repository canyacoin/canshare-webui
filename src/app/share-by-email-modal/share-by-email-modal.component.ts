import { Component, OnInit, Input } from '@angular/core';
import { InfoService } from '../@services/info.service';
import { LocalStorageService } from '../@services/local-storage.service';
import { EmailService } from '../@services/email.service';

declare var require: any;

const _ = require('lodash');

@Component({
  selector: 'app-share-by-email-modal',
  templateUrl: './share-by-email-modal.component.html',
  styleUrls: ['./share-by-email-modal.component.css']
})
export class ShareByEmailModalComponent implements OnInit {

  display: boolean = false

  onBeforeSend: boolean = false
  onSending: boolean = false
  onAfterSend: boolean = false

  filesIndexes: Array<any> = []

  @Input() to: string
  @Input() from: string
  @Input() message: string

  constructor(
    public info: InfoService,
    private ls: LocalStorageService,
    private email: EmailService) {

    info.onShareByEmail.subscribe(data => {
      this.display = data.displayEmailModal;
      this.onBeforeSend = data.onBeforeSend;
      this.onSending = data.onSending;
      this.onAfterSend = data.onAfterSend;
      this.filesIndexes = data.filesIndexes;
    });

  }

  ngOnInit() {
  }

  send(){
    let filesIndexes = this.filesIndexes;
    let files = this.ls.getFiles();

    files = _.filter(files, file => {
      return filesIndexes.indexOf(file.index) != -1;
    });

    this.email.shareFiles(files, this.to, this.from, this.message);
  }

}
