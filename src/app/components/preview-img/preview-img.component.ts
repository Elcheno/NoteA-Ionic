import { Component, Input, OnInit, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular'

@Component({
  selector: 'app-preview-img',
  templateUrl: './preview-img.component.html',
  styleUrls: ['./preview-img.component.scss'],
  standalone: true,
  imports: [ IonicModule ]
})
export class PreviewImgComponent  implements OnInit {

  @Input() img: string = '';

  private modalS = inject(ModalController);

  constructor() { }

  ngOnInit() {
    console.log('preview-img has loaded')
  }

  confirm() {
    return this.modalS.dismiss('confirm');
  }
}
