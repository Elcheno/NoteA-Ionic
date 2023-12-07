import { Component, Input, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Note } from 'src/app/model/note';
import { UIService } from 'src/app/services/ui.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Position } from 'src/app/model/position';

@Component({
  selector: 'app-update-note',
  templateUrl: './update-note.component.html',
  styleUrls: ['./update-note.component.scss'],
  standalone: true,
  imports: [ IonicModule, FormsModule, ReactiveFormsModule ],
  animations: [
    trigger('btnAnimate', [
      state('success', style({
        width: '180px'
      })),
      state('primary', style({
        width: '100px'
      })),
      transition('primary => success', [
        animate('.5s')
      ]),
      transition('success => primary', [
        animate('.25s')
      ])
    ])
  ]
})
export class UpdateNoteComponent implements OnInit {

  @Input() note!: Note;

  private modalS = inject(ModalController);
  private formB = inject(FormBuilder);
  private uiService = inject(UIService);
  
  public form!: FormGroup;
  public img: string = '';
  public location: Position = {
    latitude: '',
    longitude: ''
  };

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

    this.img = this.note.img;
    this.location = this.note.position;
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
      img: this.img,
      position: this.location
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
      this.location = {
        latitude: '',
        longitude: ''
      }
    }
  }

  async removeImg() {
    const resultDismiss = await this.uiService.dismissQuestion('Are you sure?');
    if (resultDismiss && resultDismiss === 'confirm') {
      this.img = '';
    }
  }

}
