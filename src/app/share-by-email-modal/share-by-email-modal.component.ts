import { Component, OnInit, Input } from '@angular/core';
import { InfoService } from '../@services/info.service';
import { LocalStorageService } from '../@services/local-storage.service';
import { EmailService } from '../@services/email.service';
import { Observable, Subject } from 'rxjs';

declare var require: any;

const _ = require('lodash');
const validator = require('validator');

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

  @Input() to: string = ''
  @Input() from: string = ''
  @Input() message: string

  isValidToEmail: boolean = true
  invalidToEmailMessage: string = ''
  isValidFromEmail: boolean = true
  invalidFromEmailMessage: string = ''

  onValidateToEmail: Subject<any> = new Subject<any>()

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
    let validations = this.to.split(',').map(email => {
      return this.validateToEmails(email);
    });

    Promise.all(validations).then(() => {
      this.isValidToEmail = true
      this.invalidToEmailMessage = ''

      if (!this._isValidFromEmail()) return false;
      this.isValidFromEmail = true
      this.invalidFromEmailMessage = ''

      let filesIndexes = this.filesIndexes;
      let files = this.ls.getFiles();

      files = _.filter(files, file => {
        return filesIndexes.indexOf(file.hash) != -1;
      });

      this.info.onShareByEmail.next({
        displayEmailModal: true,
        onBeforeSend: false,
        onSending: true,
        onAfterSend: false,
      });

      this.email.shareFiles(files, this.to, this.from, this.message);
    }).catch(email => {
      this.isValidToEmail = false;
      this.invalidToEmailMessage = `${email} is not a valid email address`;
      return false;
    });
  }

  validateToEmails(_email: string){
    let email = _email.replace(/\s/g,'');
    return new Promise((resolve, reject) => {
      return (typeof email == 'string' && validator.isEmail(email)) ? resolve() : reject(email);
    });
  }

  _isValidFromEmail(): boolean {
    if (typeof this.from != 'string' || !validator.isEmail(this.from)) {
      this.isValidFromEmail = false;
      this.invalidFromEmailMessage = 'Email is not a valid email address';

      return false;
    }

    return true;
  }

}
