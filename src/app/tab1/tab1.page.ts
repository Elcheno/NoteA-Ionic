import { Component, OnInit, inject } from '@angular/core';
import { IonicModule, RefresherCustomEvent, InfiniteScrollCustomEvent, SearchbarCustomEvent } from '@ionic/angular';
import { NoteService } from '../services/note.service';
import { Note } from '../model/note';
import { CommonModule } from '@angular/common';
import { UpdateNoteComponent } from '../components/update-note/update-note.component';
import { UIService } from '../services/ui.service';
import { OrderBy } from '../model/orderBy';
import { HeaderComponent } from '../components/header/header.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent],
})
export class Tab1Page implements OnInit {

  public noteS = inject(NoteService);
  private uiService = inject(UIService);

  public notes!: Note[];
  public orderBy: OrderBy = 'asc';
  private lastNoteDate: string = '';

  private onQueryDataBase: boolean = false;

  constructor() {}

  ngOnInit() {
    this.notes = [];
    this.getNotes();
  }

  getNotes(overwrite: boolean = false, params?: string): Promise<void> {
    return new Promise((resolve, _reject) => {
      try {
        this.noteS.readPaginate(this.lastNoteDate, params).pipe(take(1)).subscribe(response => {
          if (response) {
            
            if (overwrite) {
              this.notes = response;

            } else {
              for(const note of response) {
                this.notes.push(note as Note);
  
              }

            }

            if (params) {
              this.lastNoteDate = '';

            } else {
              this.lastNoteDate = this.notes[this.notes.length - 1].date;

            }

          } else {
            this.uiService.showToast("Error to charge note's list", 'danger');
            throw new Error('Firebase not response');

          }
        });

      } catch (err) {        
        this.uiService.showToast("Error to charge note's list", 'danger');
        console.error(err);

      } finally {
        resolve();

      }
    })
  }

  async editNote(note: Note): Promise<void> {
    if (note && note.key) {
      const modal = await this.uiService.showModal(UpdateNoteComponent, note);

      if (modal) {
        const { data, role } = await modal.onWillDismiss();

        if (role === 'confirm') {
          await this.uiService.showLoading();

          try {
            await this.noteS.updateNote(data).then(async () => {
              this.notes.splice(this.notes.indexOf(note), 1, data);
              await this.uiService.showToast("Nota actualizada correctamente", "success");
            });

          } catch (err) {
            await this.uiService.showToast("Error al actualizar la nota", "danger");

          } finally {
            await this.uiService.hideLoading();

          }
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
          await this.noteS.deleteNote(note).then( async () => {
            this.notes.splice(this.notes.indexOf(note), 1);
            await this.uiService.showToast("Nota eliminada correctamente", "success");
          });

        } catch (err) {
          await this.uiService.showToast("Error al eliminar la nota", "danger");

        } finally {
          await this.uiService.hideLoading();

        }
      }
    }
  }

  handleInput(event: SearchbarCustomEvent) {
    if(event.detail.value) {
      this.getNotes(true, event.detail.value);

    } else {
      this.getNotes(true);

    }
  }

  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      this.notes = [];
      this.lastNoteDate = '';
      this.getNotes();
      event.target.complete();
    }, 1000);
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    setTimeout(() => {
      this.getNotes().then(() => {
        event.target.complete();
      });
    }, 1000);
  }

}
