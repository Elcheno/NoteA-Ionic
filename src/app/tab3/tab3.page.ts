import { Component } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { CobeComponent } from '../components/cobe/cobe.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [ IonicModule, HeaderComponent, CobeComponent ],
})
export class Tab3Page {

  constructor() {}
}
