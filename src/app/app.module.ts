import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import { AppComponent } from './app.component';
import { DropzoneComponent } from './dropzone/dropzone.component';
import { FilesListComponent } from './files-list/files-list.component';
import { FileComponent } from './file/file.component';
import { IpfsService } from './@services/ipfs.service';
import { InfoService } from './@services/info.service';
import { LocalStorageService } from './@services/local-storage.service';
import { EmailService } from './@services/email.service';
import { AboutModalComponent } from './about-modal/about-modal.component';
import { CardsComponent } from './cards/cards.component';
import { ShareByEmailModalComponent } from './share-by-email-modal/share-by-email-modal.component';
import { AppRoutingModule } from './app-routing.module';
import { ShareComponent } from './share/share.component';

import { CommonLibModule } from '@canyaio/common-lib';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: '/upload',
  autoQueue: false,
  maxFilesize: 20000000000,
  // maxFiles: 1,
  uploadMultiple: true,
  acceptedFiles: null
};

@NgModule({
  declarations: [
    AppComponent,
    DropzoneComponent,
    FilesListComponent,
    FileComponent,
    AboutModalComponent,
    CardsComponent,
    ShareByEmailModalComponent,
    ShareComponent,
  ],
  imports: [
    BrowserModule,
    DropzoneModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    CommonLibModule
  ],
  providers: [
    IpfsService,
    LocalStorageService,
    InfoService,
    EmailService,
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG,
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [FileComponent]
})
export class AppModule { }
