import { Component, OnInit, NgZone } from '@angular/core';

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
    this.ipfsLink = `<a href="https://gateway.ipfs.io/ipfs/${this.ipfsHash}" target="_blank" class="link">${this.ipfsHash}</a> <span>-</span> <span class="copy">copy</span>`;
    this.zone.run(() => console.log('field run'));
  }

}
