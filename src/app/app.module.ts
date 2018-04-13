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

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: '/upload',
  autoQueue: false,
  maxFilesize: 50,
  acceptedFiles: null
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DropzoneComponent,
    FilesListComponent,
    FileComponent
  ],
  imports: [
    BrowserModule,
    DropzoneModule
  ],
  providers: [
    IpfsService,
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG,
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [FileComponent]
})
export class AppModule { }
