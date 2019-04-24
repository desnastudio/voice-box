import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {InAppBrowser} from "@ionic-native/in-app-browser";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public iab: InAppBrowser) {

  }

  openUrl(url) {
    const browser = this.iab.create(url);
    browser.show();
  }
}
