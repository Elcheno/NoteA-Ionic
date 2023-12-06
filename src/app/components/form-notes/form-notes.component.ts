import { Component,EventEmitter,Output,inject } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Note } from '../../model/note';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

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
  private img!: string;
  private latitude!: number;
  private longitude!: number;

  constructor() {
    this.form = this.formB.group({
      title:['',[Validators.required,Validators.minLength(4)]],
      description:['']
    });

  }

  public async submit(): Promise<void> {
    if (!this.form.valid) return;
    console.log(this.latitude + ' | ' + this.longitude);
    let note: Note = {
      title: this.form.get("title")?.value,
      description: this.form.get("description")?.value,
      date: new Date(Date.now()).toLocaleDateString(),
      img: this.img ? this.img : '',
      position: {
        latitude: this.latitude ? this.latitude : undefined,
        longitude: this.longitude ? this.longitude : undefined
      }
    }
    this.outSubmit.emit(note);
    this.form.reset();

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
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;
    }
  }

}
