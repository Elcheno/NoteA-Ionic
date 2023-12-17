import { Component,EventEmitter, Output, inject } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Note } from '../../model/note';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Position } from 'src/app/model/position';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';
import { UIService } from 'src/app/services/ui.service';
import { transitionAnimationBtn } from 'src/app/animations/animationBtn';
import { PreviewImgComponent } from '../preview-img/preview-img.component';
import { PreviewMapComponent } from '../preview-map/preview-map.component';
import { CommonModule } from '@angular/common';
import { informationCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-form-notes',
  templateUrl: './form-notes.component.html',
  styleUrls: ['./form-notes.component.scss'],
  standalone: true,
  imports: [ IonicModule, FormsModule, ReactiveFormsModule, LeafletMapComponent, CommonModule ],
  animations: [ transitionAnimationBtn ]
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

  constructor() {
    addIcons({ informationCircleOutline, checkmarkCircleOutline });
    
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
      const response = await this.uiService.dismissQuestion('Are you sure you want to delete the image?');
      if (response === 'confirm') {
        this.img = '';

      }
    } else {
      const image = await Camera.getPhoto({
        quality: 50,
        allowEditing: true,
        resultType: CameraResultType.Base64
      });

      await this.uiService.showLoading();
      try{
        if (image.base64String) {
          this.img = image.base64String;
          Math.round((this.img.length / 1024))
        }

      } catch (err) {
        console.error(err);

      } finally {
        await this.uiService.hideLoading();

      }
    }

  }

  public async takeLocation(): Promise<void> {
    if ((this.location.latitude && this.location.longitude)) {
      const response = await this.uiService.dismissQuestion('Are you sure to delete the location?');
      if (response === 'confirm') {
        this.location = {
          latitude: '',
          longitude: ''
        };

      }
    } else {      
      await this.uiService.showLoading();

      try {
        const coordinates = await Geolocation.getCurrentPosition();
        if (coordinates && coordinates.coords.latitude && coordinates.coords.longitude) {
          this.location = { 
            latitude: JSON.stringify(coordinates.coords.latitude), 
            longitude: JSON.stringify(coordinates.coords.longitude) 
          }
        } 

      } catch (err) {
        console.error(err)

      } finally {
        await this.uiService.hideLoading();

      }

    }
  }

  private resetForm() {
    this.form.reset();
    this.img = '';
    this.location = { latitude: '', longitude: '' };
    this.form.controls['datetimePicker'].setValue(new Date(Date.now()).toISOString());
  }

  async showImg() {
    this.uiService.showModal(PreviewImgComponent, this.img);
  }

  async showMap() {
    this.uiService.showModal(PreviewMapComponent, this.location);
  }

}
