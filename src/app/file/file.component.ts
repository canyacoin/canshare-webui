import { Component, OnInit, NgZone } from '@angular/core';

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

  constructor(private zone: NgZone) {}

  ngOnInit() {
  }

  renderIpfsLink() {
    console.log(this.ipfsHash);
    let link = `https://gateway.ipfs.io/ipfs/${this.ipfsHash}`;
    this.ipfsLink = `<a href="${link}" target="_blank" class="link">${this.ipfsHash}</a> <span>-</span> <span class="copy copy-${this.ipfsHash}">copy</span>`;
    this.zone.run(() => console.log('field run'));

    new clipboard(`.copy-${this.ipfsHash}`, {
      text: function(trigger) {

        trigger.innerText = 'copied!';
        trigger.classList.add('copied');
        setTimeout(() => {
          trigger.innerText = 'copy';
          trigger.classList.remove('copied');
        }, 2000);

        return link;
      }
    });
  }

}
