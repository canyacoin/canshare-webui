import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

  renderIpfsLink() {
    // <a href="#" class="link">file ipfs link</a> <span>-</span> <span class="copy">copy</span>
  }

}
