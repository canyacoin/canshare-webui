import { Component, OnInit, NgZone } from '@angular/core';
import { IpfsService } from '../@services/ipfs.service';
import { InfoService } from '../@services/info.service';

declare var require: any;
declare var window: any;

const clipboard = require('clipboard');

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})

export class FileComponent implements OnInit {

  index: number

  name: string

  size: number

  pctg: string

  progress: number

  ipfsLink: string

  ipfsHash: string

  isUploading: boolean = true
  streamEnded: boolean = false
  isSelected: boolean = false

  copiedText: string = 'copy-file-link'

  constructor(
    private zone: NgZone,
    public ipfs: IpfsService,
    public info: InfoService) {}

  ngOnInit() {
  }

  ngAfterViewChecked(){
    window.$('[data-toggle="tooltip"]').tooltip();
  }

  cancelUpload(){}

  onClick($event){
    if ($event.shiftKey) {
      console.log('shift-key');
    }

    if ($event.ctrlKey || $event.metaKey) {
      console.log('cmd-key');

      if (this.isSelected) {
        this.deselect();
        return false;
      }

      this.select();

      return false;
    }

    this.info.deselectAll();
    this.select();
  }

  deselect(){
    this.isSelected = false;

    this.info.deselectFile(this.ipfsHash);
  }

  select(){
    if (this.isUploading) return false

    this.isSelected = true;

    this.info.selectFile(this.ipfsHash);
  }

  renderIpfsLink() {
    console.log(this.ipfsHash);

    let link = `${this.ipfs.gatewayURL}/${this.ipfsHash}`;

    this.ipfsLink = link;

    this.zone.run(() => console.log('field run'));

    let self = this

    new clipboard(`.copy-${this.ipfsHash}`, {
      text: function(trigger) {

        self.copiedText = 'copied'
        trigger.classList.add('copied');
        setTimeout(() => {
          self.copiedText = 'copy-file-link';
          trigger.classList.remove('copied');
        }, 2000);

        return link;
      }
    });
  }

}
