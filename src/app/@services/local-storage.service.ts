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

  getFile(hash) {
    return this.getFiles()[hash];
  }

  store(data) {
    localStorage.setItem('canshare', JSON.stringify(data));
  }

  storeFile(hash, data) {
    let files = this.getFiles();

    files[hash] = data;

    this.store({ files });
  }
}
