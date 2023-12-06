import { Component,EventEmitter,Output,inject } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Note } from '../../model/note';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Position } from 'src/app/model/position';

@Component({
  selector: 'app-form-notes',
  templateUrl: './form-notes.component.html',
  styleUrls: ['./form-notes.component.scss'],
  standalone: true,
  imports: [ IonicModule, FormsModule, ReactiveFormsModule ]
})
export class FormNotesComponent  {

  @Output() outSubmit = new EventEmitter<Note>();

  private formB = inject(FormBuilder);
  public loadingS = inject(LoadingController);

  public form!: FormGroup;
  public img!: string | undefined;
  public location: Position = {
    latitude: undefined,
    longitude: undefined
  }

  constructor() {
    this.form = this.formB.group({
      title:['',[Validators.required,Validators.minLength(4)]],
      description:[''],
    });

  }

  public async submit(): Promise<void> {
    if (!this.form.valid) return;
    let note: Note = {
      title: this.form.get("title")?.value,
      description: this.form.get("description")?.value,
      date: new Date(Date.now()).toLocaleDateString(),
      img: this.img,
      position: this.location
    }
    this.outSubmit.emit(note);
    this.resetForm();

  }

  public async takePic() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64
    })
    if (image.base64String) this.img = image.base64String;
  }

  public async takeLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    if (coordinates && coordinates.coords.latitude && coordinates.coords.longitude) {
      this.location = { latitude: coordinates.coords.latitude, longitude: coordinates.coords.longitude }
    }
  }

  private resetForm() {
    this.form.reset();
    this.img = undefined;
    this.location = { latitude: undefined, longitude: undefined }
  }

}
