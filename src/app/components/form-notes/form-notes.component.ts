import { Component,EventEmitter, OnInit, Output, inject } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Note } from '../../model/note';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Position } from 'src/app/model/position';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';
import { UIService } from 'src/app/services/ui.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-form-notes',
  templateUrl: './form-notes.component.html',
  styleUrls: ['./form-notes.component.scss'],
  standalone: true,
  imports: [ IonicModule, FormsModule, ReactiveFormsModule, LeafletMapComponent ],
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
export class FormNotesComponent {

  @Output() outSubmit = new EventEmitter<Note>();

  private formB = inject(FormBuilder);
  public loadingS = inject(LoadingController);
  private uiService = inject(UIService);

  public form!: FormGroup;
  public img: string = '';
  public location: Position = {
    latitude: '',
    longitude: ''
  }
  public btnAnimateLocation: boolean = false;
  public btnAnimateImg: boolean = false;

  constructor() {
    this.form = this.formB.group({
      title:['',[Validators.required,Validators.minLength(4)]],
      description:[''],
      datetimePicker: [new Date(Date.now()).toISOString(), [Validators.required]]
    });

  }

  public async submit(): Promise<void> {
    if (!this.form.valid) return;
    let note: Note = {
      title: this.form.get("title")?.value,
      description: this.form.get("description")?.value,
      date: this.form.get("datetimePicker")?.value,
      img: this.img,
      position: this.location
    }
    this.outSubmit.emit(note);
    this.resetForm();
    
  }

  public async takePic() {
    if (this.img) {
      const response = await this.uiService.dismissQuestion('Are you sure?');
      if (response === 'confirm') {
        this.img = '';
        this.btnAnimateImg = !this.btnAnimateImg;

      }
    } else {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64
      });
      if (image.base64String) {
        this.img = image.base64String;
        this.btnAnimateImg = !this.btnAnimateImg;
      }
    }

  }

  public async takeLocation() {
    if ((this.location.latitude && this.location.longitude)) {
      const response = await this.uiService.dismissQuestion('Are you sure?');
      if (response === 'confirm') {
        this.location = {
          latitude: '',
          longitude: ''
        };
        this.btnAnimateLocation = !this.btnAnimateLocation;

      }
    } else {
      const coordinates = await Geolocation.getCurrentPosition();
      if (coordinates && coordinates.coords.latitude && coordinates.coords.longitude) {
        this.location = { 
          latitude: JSON.stringify(coordinates.coords.latitude), 
          longitude: JSON.stringify(coordinates.coords.longitude) 
        }
        this.btnAnimateLocation = !this.btnAnimateLocation;

      }
    }

  }

  private resetForm() {
    this.form.reset();
    this.img = '';
    this.location = { latitude: '', longitude: '' };
  }

}
