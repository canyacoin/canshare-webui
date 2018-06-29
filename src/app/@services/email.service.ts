import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { InfoService } from './info.service';

declare let require: any;

@Injectable()
export class EmailService {

  appURL: string = 'http://localhost:4200'

  entryPoint = 'https://us-central1-canshare-app.cloudfunctions.net';
  // entryPoint = 'https://us-central1-canshare-dev.cloudfunctions.net';

  constructor(
    private http: Http,
    private info: InfoService) {}

  sendRequest(entryPoint: string, object: any) {
    console.log('sendRequest', object);

    return this.http.post(entryPoint, object)
      .toPromise()
      .then((res: any) => {
        console.log(JSON.parse(res._body));
        this.info.onShareByEmail.next({
          displayEmailModal: true,
          onBeforeSend: false,
          onSending: false,
          onAfterSend: true,
        });
      })
      .catch(error => console.log(error));
  }

  shareFiles(files: Array<any>, to: string, from: string, subject?: string, message?: string){
    let req = {
      files: files,
      to: to,
      from: from,
      subject: subject,
      message: message,
    };

    return this.sendRequest(`${this.entryPoint}/shareFiles`, req);
  }

}
