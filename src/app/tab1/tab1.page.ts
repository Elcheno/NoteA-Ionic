import { Component,inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NoteService } from '../services/note.service';
import { Note } from '../model/note';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { UpdateNoteComponent } from '../components/update-note/update-note.component';
import { UIService } from '../services/ui.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule,CommonModule],
})
export class Tab1Page {

  public noteS = inject(NoteService);
  private modalS = inject(ModalController);
  private uiService = inject(UIService);

  constructor() {}

  async editNote(note: Note): Promise<void> {
    if (note && note.key) {
      const modal = await this.modalS.create({
        component: UpdateNoteComponent,
        componentProps: { note: note }
      });
      modal.present();

      const { data, role } = await modal.onWillDismiss();
      if (role === 'confirm') {
        await this.uiService.showLoading();

        try {
          await this.noteS.updateNote(data).then(()=> console.log('nota ha sido actulizada'));
          await this.uiService.showToast("Nota actualizada correctamente", "success");

        } catch (err) {
          await this.uiService.showToast("Error al actualizar la nota", "danger");

        } finally {
          await this.uiService.hideLoading();

        }
       
      }
    }
  }

  async deleteNote(note: Note): Promise<void> {
    if (note && note.key) {
      const resultDismiss = await this.uiService.dismissQuestion('Are you sure?');
      if (resultDismiss && resultDismiss === 'confirm') {
        await this.uiService.showLoading();

        try {
          await this.noteS.deleteNote(note).then(()=> console.log('nota eliminada'));
          await this.uiService.showToast("Nota eliminada correctamente", "success");

        } catch (err) {
          await this.uiService.showToast("Error al eliminar la nota", "danger");

        } finally {
          await this.uiService.hideLoading();

        }
      }
    }
  }

}
