import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import createGlobe from 'cobe';
import { Subscription, fromEvent } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-cobe',
  template: `
  <div
    #canvasContainer
    style="width: 100%; max-width: 600px; aspect-ratio: 1; margin: auto; position: relative;"
  >
    <canvas
      #canvas
      style="width: 100%; height: 100%; cursor: grab; contain: layout paint size; opacity: 0; transition: opacity 1s ease;"
    ></canvas>
  </div>
`,
  standalone: true,
  imports: [],
})
export class CobeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('canvasContainer') canvasContainer!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  private globe: any; // Adjust the type if there is a specific type for createGlobe

  private pointerInteracting: number | null = null;
  private pointerInteractionMovement = 0;
  private resizeSubscription: Subscription | undefined;
  private phi = 0;

  ngOnInit() {
    this.resizeSubscription = fromEvent(window, 'resize').subscribe(() => this.onResize());
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeGlobe();

    }, 100);
  }

  ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
    if (this.globe) {
      this.globe.destroy();
    }
  }

  private onResize() {
    const width = this.canvasContainer.nativeElement.offsetWidth;
    if (this.globe) {
      this.globe['height'] = width * 2;
      this.globe['width'] = width * 2;
    }
  }

  private initializeGlobe() {
    const width = this.canvasContainer.nativeElement.offsetWidth;
    const canvas = this.canvas.nativeElement;

    this.globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [251 / 255, 100 / 255, 21 / 255],
      glowColor: [1.2, 1.2, 1.2],
      markers: [],
      onRender: (state: any) => {  
        //console.log(this.phi);     
        state['phi'] = this.pointerInteracting ? this.pointerInteractionMovement : this.phi;
        this.phi = this.pointerInteracting ? this.pointerInteractionMovement : this.phi + 0.01;
      },
    });

    setTimeout(() => (canvas.style.opacity = '1'));

    const canvasElement = canvas as HTMLCanvasElement;

    fromEvent(canvasElement, 'pointerdown').subscribe((e: any) => {
      this.pointerInteracting = e.clientX - this.pointerInteractionMovement;
      canvasElement.style.cursor = 'grabbing';
    });

    fromEvent(canvasElement, 'touchstart').subscribe((e: any) => {
      console.log('phone start')
      console.log(e.touches[0].clientX)
      this.pointerInteracting = e.touches[0].clientX - this.pointerInteractionMovement;
    });
    

    fromEvent(canvasElement, 'pointerup').subscribe(() => {
      this.pointerInteracting = null;
      canvasElement.style.cursor = 'grab';
      setTimeout(()=>{
        this.createHandlerMovement(canvasElement);
      }, 200);
    });

    fromEvent(canvasElement, 'pointerout').subscribe(() => {
      this.pointerInteracting = null;
      canvasElement.style.cursor = 'grab';
    });


    fromEvent(canvasElement, 'touchend').subscribe(() => {
      console.log('phone end')
      this.pointerInteracting = null;
      setTimeout(()=>{
        this.createHandlerMovementPhone(canvasElement);
      }, 200);
    });



    this.createHandlerMovement(canvasElement);
    this.createHandlerMovementPhone(canvasElement);

  }

  private createHandlerMovement(canvasElement: any){
    fromEvent<MouseEvent>(canvasElement, 'mousemove')
      .pipe(
        takeUntil(fromEvent(canvasElement, 'pointerup')),
        switchMap((e) => {
          if (this.pointerInteracting !== null) {
            const delta = e.clientX - this.pointerInteracting;
            this.pointerInteractionMovement = delta/200;
            return [delta / 200];
          } else {
            return [];
          }
        })
      ).subscribe(e => {
        console.log(e);
      })
  }

  private createHandlerMovementPhone(canvasElement: any){
    fromEvent<TouchEvent>(canvasElement, 'touchmove')
    .pipe(
      takeUntil(fromEvent(canvasElement, 'touchend')),
      switchMap((e) => {
        if (this.pointerInteracting !== null && e.touches) {
          console.log(e.touches[0].clientX + " | " + this.pointerInteracting)
          const delta = e.touches[0].clientX - this.pointerInteracting;
          this.pointerInteractionMovement = delta / 0.01;
          return [delta / 200];
        } else {
          return [];
        }
      })
    ).subscribe(e => {
      console.log(e);
    })
  }
  
}


