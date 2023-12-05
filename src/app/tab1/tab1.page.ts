import { Component,inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NoteService } from '../services/note.service';
import { Note } from '../model/note';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule,CommonModule],
})
export class Tab1Page {

  public noteS = inject(NoteService);
  constructor() {}

  ionViewDidEnter(){
    /*this.misnotas=[];
    this.noteS.readAll().subscribe(d=>{
      console.log(d)
      d.docs.forEach((el:any) => {
        this.misnotas.push({'key':el.id,...el.data()});
      });
    })*/
  }

  editNote(note: Note) {
    if (note && note.key) {

    }
    return;
  }

  async deleteNote(note: Note) {
    if (note && note.key) {
      await this.noteS.deleteNote(note).then(()=> console.log("nota eliminada"));
    }
    return;
  }



}
