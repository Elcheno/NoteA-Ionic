import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import createGlobe from 'cobe';

@Component({
  selector: 'app-cobe-world',
  templateUrl: './cobe-world.component.html',
  styleUrls: ['./cobe-world.component.scss'],
  standalone: true,
  imports: []
})
export class CobeWorldComponent  implements OnInit, AfterViewInit {
  
  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  private phi = 0;

  constructor() { }

  ngOnInit() {
    console.log('cobe-world init');
  }

  ngAfterViewInit() {
      setTimeout(() => {
        this.renderGlobe();
    }, 100);
  }

  renderGlobe(): any {
    return createGlobe(this.canvas.nativeElement, {
      devicePixelRatio: 2,
      width: 400,
      height: 400,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 }
      ],
      onRender: state => {
        state['phi'] = this.phi;
        this.phi += 0.01;
      }
  })
  }

}
