import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from 'src/app/model/note';
import { IonicModule, ModalController } from '@ionic/angular';
import { UIService } from 'src/app/services/ui.service';
import { PreviewImgComponent } from '../preview-img/preview-img.component';
import { PreviewMapComponent } from '../preview-map/preview-map.component';

@Component({
  selector: 'app-view-note',
  templateUrl: './view-note.component.html',
  styleUrls: ['./view-note.component.scss'],
  standalone: true,
  imports: [ IonicModule, CommonModule ]
})
export class ViewNoteComponent  implements OnInit {

  @Input() param!: Note;

  private modalService = inject(ModalController);
  private uiService = inject(UIService);

  constructor() {}

  ngOnInit() {
    if (!this.param) this.modalService.dismiss();
  }

  back() {
    return this.modalService.dismiss();
  }

  showMap() {
    this.uiService.showModal(PreviewMapComponent, this.param.position);
  }

  showImg() {
    this.uiService.showModal(PreviewImgComponent, this.param.img);
  }

}