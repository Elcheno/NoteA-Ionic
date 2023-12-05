import { Component,inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NoteService } from '../services/note.service';
import { Note } from '../model/note';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { UpdateNoteComponent } from '../components/update-note/update-note.component';

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

  constructor() {}

  // ionViewDidEnter(){
    /*this.misnotas=[];
    this.noteS.readAll().subscribe(d=>{
      console.log(d)
      d.docs.forEach((el:any) => {
        this.misnotas.push({'key':el.id,...el.data()});
      });
    })*/
  // }

  async editNote(note: Note): Promise<void> {
    if (note && note.key) {
      const modal = await this.modalS.create({
        component: UpdateNoteComponent,
        componentProps: { note: note }
      });
      modal.present();

      const { data, role } = await modal.onWillDismiss();
      if (role === 'confirm') {
        await this.noteS.updateNote(data).then(()=> console.log('nota ha sido actulizada'));
      }
    }
  }

  async deleteNote(note: Note): Promise<void> {
    if (note && note.key) {
      await this.noteS.deleteNote(note).then(()=> console.log('nota eliminada'));
    }
  }



}
