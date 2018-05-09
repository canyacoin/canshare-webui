import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DropzoneComponent } from './dropzone/dropzone.component';
import { FilesListComponent } from './files-list/files-list.component';
import { FileComponent } from './file/file.component';
import { IpfsService } from './@services/ipfs.service';
import { InfoService } from './@services/info.service';
import { LocalStorageService } from './@services/local-storage.service';
import { AboutModalComponent } from './about-modal/about-modal.component';
import { CardsComponent } from './cards/cards.component';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: '/upload',
  autoQueue: false,
  maxFilesize: 1000000000,
  maxFiles: 1,
  acceptedFiles: null
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DropzoneComponent,
    FilesListComponent,
    FileComponent,
    AboutModalComponent,
    CardsComponent
  ],
  imports: [
    BrowserModule,
    DropzoneModule
  ],
  providers: [
    IpfsService,
    LocalStorageService,
    InfoService,
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG,
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [FileComponent]
})
export class AppModule { }
