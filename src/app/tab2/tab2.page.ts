import { Component, inject } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular'
import { Note } from '../model/note';
import { NoteService } from '../services/note.service';
import { UIService } from '../services/ui.service';
import { FormNotesComponent } from '../components/form-notes/form-notes.component';
// import { Map } from 'leaflet';
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, FormNotesComponent ]
})
export class Tab2Page {

  private noteS = inject(NoteService);
  private UIS = inject(UIService);
  public loadingS = inject(LoadingController);

  constructor() {}

  public async saveNote(note: Note): Promise<void> {
    if (note && !note.key) {
      await this.UIS.showLoading();
      try {
        await this.noteS.addNote(note);
        await this.UIS.showToast("Nota introducida correctamente", "success");

      } catch (error) {
        await this.UIS.showToast("Error al insertar la nota", "danger");
        console.error(error);
        console.error(note);

      } finally {
        await this.UIS.hideLoading();

      }
    }
  }
}
