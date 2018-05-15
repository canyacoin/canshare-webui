import { Component, OnInit, NgZone } from '@angular/core';
import { IpfsService } from '../@services/ipfs.service';
import { InfoService } from '../@services/info.service';

declare var require: any;

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

  pctg: number

  progress: number

  ipfsLink: string = '<span class="link-placeholder">[ipfs link will appear here]</span>'

  ipfsHash: string

  isUploading: boolean = true

  isSelected: boolean = false

  constructor(
    private zone: NgZone,
    public ipfs: IpfsService,
    public info: InfoService) {}

  ngOnInit() {
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

    this.info.deselectFile(this.index);
  }

  select(){
    this.isSelected = true;

    this.info.selectFile(this.index);
  }

  renderIpfsLink() {
    console.log(this.ipfsHash);
    let link = `https://gateway.ipfs.io/ipfs/${this.ipfsHash}`;

    this.ipfsLink = `<a href="${link}" target="_blank" class="link">${this.ipfsHash}</a> <span>-</span> <span class="copy copy-${this.ipfsHash}">copy</span>`;

    this.zone.run(() => console.log('field run'));

    new clipboard(`.copy-${this.ipfsHash}`, {
      text: function(trigger) {

        trigger.innerText = 'Copied!';
        trigger.classList.add('copied');
        setTimeout(() => {
          trigger.innerText = 'Copy file link';
          trigger.classList.remove('copied');
        }, 2000);

        return link;
      }
    });
  }

}
