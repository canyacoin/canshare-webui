import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InfoService } from '../@services/info.service';
import { LocalStorageService } from '../@services/local-storage.service';
import { IpfsService } from '../@services/ipfs.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private info: InfoService,
    private ls: LocalStorageService,
    private ipfs: IpfsService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let hash = params['ipfsHash'];

      if (hash) {
        this.route.queryParams.subscribe(query => {
          let name = query['name'];
          let size = query['size'];
          if (name && size) {
            let files = this.ls.getFiles();

            files[hash] = {
              index: this.ipfs.fileCount,
              hash: hash,
              size: size,
              name: name,
              type: 'application/pdf',
              pctg: '100%',
            }

            this.ls.store({ files });

            this.info.displayShareFileByEmailModal([hash])
          }
        });
      }
    });
  }

}
