import { Component, Input, OnInit, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular'
import { Position } from 'src/app/model/position';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';


@Component({
  selector: 'app-preview-map',
  templateUrl: './preview-map.component.html',
  styleUrls: ['./preview-map.component.scss'],
  standalone: true,
  imports: [IonicModule, LeafletMapComponent ]
})
export class PreviewMapComponent  implements OnInit {

  @Input() location: Position = {
    latitude: '',
    longitude: ''
  }

  private modalS = inject(ModalController);

  constructor() { }

  ngOnInit() {
    console.log('map-preview has loaded')
    console.log(this.location)
  }

  confirm() {
    return this.modalS.dismiss('confirm');
  }

}
