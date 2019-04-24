import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

/*
 * Generated class for the DropboxProvider provider.
 * See https://angular.io/guide/dependency-injection for more info on providers and Angular DI.
 */
@Injectable()
export class DropboxProvider {

  accessToken: any;
  folderHistory: any = [];
  appKey: any;
  redirectURI: any;
  url: any;

  constructor(public http: HttpClient, public platform: Platform, public iab: InAppBrowser) {
    //console.log('Hello DropboxProvider Provider');
    //Dropbox App Key for OAuth and use API
    this.appKey = 'xxxxxxxxxxxxxxx';
    this.redirectURI = 'http://localhost';
    this.url = 'https://www.dropbox.com/1/oauth2/authorize?client_id=' + this.appKey + '&redirect_uri=' + this.redirectURI + '&response_type=token';
    if (localStorage.getItem('access_token')) {
      this.setAccessToken(localStorage.getItem('access_token'));
    }
  }

  setAccessToken(token) {
    this.accessToken = token;
  }

  login() {
    return new Promise((resolve, reject) => {
      let browser = this.iab.create(this.url, '_blank'),
      listener = browser.on('loadstart').subscribe((event: any) => {
        //Ignore the dropbox authorize screen
        if (event.url.indexOf('oauth2/authorize') > -1) {
          return;
        }

        //Check the redirect uri
        if (event.url.indexOf(this.redirectURI) > -1) {
          listener.unsubscribe();
          browser.close();
          let token = event.url.split('=')[1].split('&')[0];
          this.setAccessToken(token);
          localStorage.setItem('access_token', token);
          resolve(event.url);
        } else {
          reject("Could not authenticate");
        }
      });
    });
  }

  getUserInfo() {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.accessToken,
      'Content-Type': 'application/json'
    });

    return this.http.post('https://api.dropboxapi.com/2/users/get_current_account', "null", {headers: headers})
      .map(res => console.log('getUserInfo:',res));
  }

  getFolders(path?) {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.accessToken,
      'Content-Type': 'application/json'
    });

    let folderOptions = {
      path: '',
      recursive: false,
      include_media_info: false,
      include_deleted: false,
      include_has_explicit_shared_members: false,
      include_mounted_folders: true,
      shared_link: true
    };

    if (typeof(path) !== "undefined" && path) {
      folderOptions.path = path;

      if (this.folderHistory[this.folderHistory.length - 1] != path) {
        this.folderHistory.push(path);
      }
    }

    return this.http.post('https://api.dropboxapi.com/2/files/list_folder', JSON.stringify(folderOptions), {headers: headers})
      .map(res => res);
  }

  goBackFolder() {
    if (this.folderHistory.length > 0) {

      this.folderHistory.pop();
      let path = this.folderHistory[this.folderHistory.length - 1];

      return this.getFolders(path);
    } else {
      return this.getFolders();
    }
  }

  uploadFile(fileName: string, data: any) {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.accessToken,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': '{"path": "/' + fileName + '","mode": "add","autorename": true,"mute": false,"strict_conflict": false}'
    });
    console.log('headers:', headers);

    return this.http.post('https://content.dropboxapi.com/2/files/upload', data, {headers: headers})
      .map(res => res);
  }

  getSharedLinks(path: string) {
    let headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json'
      }),
      data = path === '' ? {} : {path: path};

    console.log('data:', data);
    return this.http.post('https://api.dropboxapi.com/2/sharing/list_shared_links', data, {headers: headers})
      .map(res => res);
  }

  createSharedLink(fileName: string) {
    let headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json'
      }),
      data = {
        path: '/' + fileName,
        settings: {requested_visibility: 'public'}
      };

    //console.log('headers:',headers);
    return this.http.post('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', data, {headers: headers})
      .map(res => res);
  }
}
