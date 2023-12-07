import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Map, MapOptions, tileLayer, latLng, marker, Icon, icon, LatLng } from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';


@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss'],
  standalone: true,
  imports: [ LeafletModule ]
})
export class LeafletMapComponent implements OnInit, OnDestroy {
  @Input() latitude: number | undefined = 100;
  @Input() longitude: number | undefined = 100;
  
  options: MapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
      { 
        maxZoom: 18,   
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })],
    zoom: 15,
    center: latLng(100, 100)
  };

  public map!: Map;
  public zoom!: number;

  constructor() { }

  onMapReady(map: Map) {
    if (this.latitude && this.longitude) {
      marker([ this.latitude, this.longitude ], {
        icon: icon({
          ...Icon.Default.prototype.options,
          iconUrl: 'leaflet/marker-icon.png',
          iconRetinaUrl: 'leaflet/marker-icon-2x.png',
          shadowUrl: 'leaflet/marker-shadow.png'
        }),
        autoPanOnFocus: true
      }).addTo(map);
      map.setView(latLng(this.latitude, this.longitude));
    } else {
      if(this.map) this.map.remove();
    }
  }

  ngOnInit() {;
  }

  ngOnDestroy() {
    if(this.map) this.map.remove();
  };

}
