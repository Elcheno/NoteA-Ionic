import { Component, Input, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Note } from 'src/app/model/note';
import { UIService } from 'src/app/services/ui.service';
import { Position } from 'src/app/model/position';
import { transitionAnimationBtn } from 'src/app/animations/animationBtn';

@Component({
  selector: 'app-update-note',
  templateUrl: './update-note.component.html',
  styleUrls: ['./update-note.component.scss'],
  standalone: true,
  imports: [ IonicModule, FormsModule, ReactiveFormsModule ],
  animations: [ transitionAnimationBtn ]
})
export class UpdateNoteComponent implements OnInit {

  @Input() param!: Note;

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
    if (this.param && this.param.title) {
      const { key, date, img, position, ...aux } = this.param;
      this.form.setValue(aux);
    }

    this.img = this.param.img;
    this.location = this.param.position;
  }

  cancel() {
    return this.modalS.dismiss(null, 'cancel');
  }

  async confirm() {
    if (!this.form.valid) return;
    const aux: Note = {
      key: this.param.key,
      title: this.form.value.title,
      description: this.form.value.description,
      date: this.param.date,
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
