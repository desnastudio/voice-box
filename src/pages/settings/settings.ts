import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {DropboxProvider} from "../../providers/dropbox/dropbox";
import {TabsPage} from "../tabs/tabs";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  isAuth: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dropbox: DropboxProvider) {

  }

  ionViewDidEnter() {
    if (localStorage.getItem('access_token'))
      this.isAuth = true;
    else
      this.isAuth = false;
  }

  login() {
    this.dropbox.login().then((success) => {
      this.navCtrl.setRoot(TabsPage).then(res => {
        console.log(res);
      });
    }, (err) => {
      console.log(err);
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    this.dropbox.setAccessToken(null);
    this.navCtrl.setRoot(LoginPage).then(res => {
      console.log(res);
    });
  }
}
