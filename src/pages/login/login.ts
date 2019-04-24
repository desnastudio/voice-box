import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { TabsPage } from '../tabs/tabs';
import { DropboxProvider } from '../../providers/dropbox/dropbox';

/**
 * Generated class for the LoginPage page.
 * See https://ionicframework.com/docs/components/#navigation for more info on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  isConnected: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toast: ToastController,
              private network: Network, public dropbox: DropboxProvider) {
    this.checkConnection();
  }

  checkConnection() {
    this.network.onConnect().subscribe(() => {
      this.isConnected = true;

      this.toast.create({
        message: 'Network Connected',
        duration: 3000,
      }).present();
    });

    this.network.onDisconnect().subscribe(() => {
      this.isConnected = false;

      this.toast.create({
        message: 'Network Disconnected',
        duration: 3000
      }).present();
    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginPage');
    let elements = document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'none';
      });
    }
  }

  ionViewDidEnter() {
    this.checkConnection();
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

  withoutLogin() {
    this.navCtrl.setRoot(TabsPage).then(res => {
      console.log(res);
    });
  }
}
