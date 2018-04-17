import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  init() {
    let storage = localStorage.getItem('canshare');

    if (storage) {
      return null;
    }

    localStorage.setItem('canshare', JSON.stringify({files: {}}));
  }

  get() {
    return JSON.parse(localStorage.getItem('canshare'));
  }

  getFiles() {
    return this.get().files;
  }

  store(data) {
    localStorage.setItem('canshare', JSON.stringify(data));
  }
}
