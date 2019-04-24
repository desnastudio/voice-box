import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { FilesPage } from '../files/files';
import { AboutPage } from '../about/about';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = FilesPage;
  tab3Root = AboutPage;
  tab4Root = SettingsPage;

  constructor() {

  }
}
