import { Component, Input, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Note } from 'src/app/model/note';

@Component({
  selector: 'app-update-note',
  templateUrl: './update-note.component.html',
  styleUrls: ['./update-note.component.scss'],
  standalone: true,
  imports: [ IonicModule, FormsModule, ReactiveFormsModule ]
})
export class UpdateNoteComponent implements OnInit {

  @Input() note!: Note;

  private modalS = inject(ModalController);
  private formB = inject(FormBuilder);

  public form!: FormGroup;

  constructor() {
    this.form = this.formB.group({
      title:['',[Validators.required,Validators.minLength(4)]],
      description:['']
    });
  }

  ngOnInit() {
    if (this.note && this.note.title) {
      const { key, date,...aux } = this.note;
      this.form.setValue(aux);
    }
  }

  cancel() {
    return this.modalS.dismiss(null, 'cancel');
  }

  confirm() {
    if(!this.form.valid) return;
    const aux: Note = {
      key: this.note.key,
      title: this.form.value.title,
      description: this.form.value.description,
      date: this.note.date,
    };
    return this.modalS.dismiss(aux, 'confirm');
  }

}
