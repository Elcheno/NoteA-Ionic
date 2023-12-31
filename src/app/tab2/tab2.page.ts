import { Component, inject } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular';
import { Note } from '../model/note';
import { NoteService } from '../services/note.service';
import { UIService } from '../services/ui.service';
import { FormNotesComponent } from '../components/form-notes/form-notes.component';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, FormNotesComponent, HeaderComponent ]
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
        await this.UIS.showToast("Note successfully saved", "success");

      } catch (error) {
        if(note.img.length / 1024 >= 1500) {
          await this.UIS.showToast("Error image size exceeded", "danger");

        } else {
          await this.UIS.showToast("Error saving the note", "danger");
          console.error(error);
          console.error(note);
        }

      } finally {
        await this.UIS.hideLoading();

      }
    }
  }
}
