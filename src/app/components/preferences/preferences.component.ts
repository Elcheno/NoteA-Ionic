import { Component, OnInit, inject } from '@angular/core';
import { IonicModule, ToggleCustomEvent } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { Preferences } from '@capacitor/preferences';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  standalone: true,
  imports: [ IonicModule, CommonModule, FormsModule ]
})
export class PreferencesComponent  implements OnInit {

  private ModalService = inject(ModalController);

  public isDark: boolean = true;

  constructor() { }

  async ngOnInit() {
    const { value } = await Preferences.get({ key: 'dark' });
    if (value === 'on') {
      this.isDark = true;

    } else if (value === 'off') {
      this.isDark = false;
      
    }
  }

  async darkToggleChange(event: ToggleCustomEvent) {
    if (!event) return;

    if (event) {
      this.isDark = event.detail.checked;
    }

    document.body.classList.toggle('dark');

  }

  back() {
    this.ModalService.dismiss();
  }

  async save() {
    await Preferences.set({
      key: 'dark',
      value: this.isDark ? 'on' : 'off'
    });

    this.ModalService.dismiss();
  }

}
