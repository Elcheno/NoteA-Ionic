import { Component } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { CobeWorldComponent } from '../components/cobe-world/cobe-world.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [ IonicModule, HeaderComponent, CobeWorldComponent ],
})
export class Tab3Page {
  constructor() {}
}
