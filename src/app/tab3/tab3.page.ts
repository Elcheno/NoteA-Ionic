import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { CobeWorldComponent } from '../components/cobe-world/cobe-world.component';
import { CobeComponent } from '../components/cobe/cobe.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [ IonicModule, HeaderComponent, CobeWorldComponent, CobeComponent ],
})
export class Tab3Page implements OnInit {

  constructor() {}

  ngOnInit(): void {
    console.log(window.matchMedia('(prefers-color-scheme: dark)'));
    //document.body.classList.toggle( 'dark' ); 

  }

}
