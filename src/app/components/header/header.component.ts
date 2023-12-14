import { Component, Input, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cog } from 'ionicons/icons';
import { PreferencesComponent } from 'src/app/components/preferences/preferences.component';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [ IonicModule ]
})
export class HeaderComponent {

  @Input() title!: string;

  private UIService = inject(UIService);

  constructor() {
    addIcons({ cog });
  }

  editPreferences() {
    this.UIService.showModal(PreferencesComponent);
  }

}
