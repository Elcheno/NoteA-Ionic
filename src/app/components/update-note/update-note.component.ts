import { Component, Input, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Note } from 'src/app/model/note';
import { UIService } from 'src/app/services/ui.service';

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
  private uiService = inject(UIService);
  
  public form!: FormGroup;

  constructor() {
    this.form = this.formB.group({
      title:['',[Validators.required,Validators.minLength(4)]],
      description:['']
    });
  }

  ngOnInit() {
    if (this.note && this.note.title) {
      const { key, date, img, position, ...aux } = this.note;
      this.form.setValue(aux);
    }
  }

  cancel() {
    return this.modalS.dismiss(null, 'cancel');
  }

  async confirm() {
    if (!this.form.valid) return;
    const aux: Note = {
      key: this.note.key,
      title: this.form.value.title,
      description: this.form.value.description,
      date: this.note.date,
      img: this.note.img,
      position: this.note.position
    };

    const resultDismiss = await this.uiService.dismissQuestion('Are you sure?');
    if (resultDismiss && resultDismiss === 'confirm') {
      return this.modalS.dismiss(aux, 'confirm');
    }
    return;
  }

  async removeLocation() {
    const resultDismiss = await this.uiService.dismissQuestion('Are you sure?');
    if (resultDismiss && resultDismiss === 'confirm') {
      this.note.position = {
        latitude: 1000,
        longitude: 1000
      }
    }
  }

  async removeImg() {
    const resultDismiss = await this.uiService.dismissQuestion('Are you sure?');
    if (resultDismiss && resultDismiss === 'confirm') {
      this.note.img = '';
    }
  }

}
