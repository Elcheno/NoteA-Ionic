import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Preferences } from '@capacitor/preferences';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet]
})
export class AppComponent implements OnInit {

  constructor() {}

  async ngOnInit(): Promise<void> {
    await SplashScreen.show({
      autoHide: false,
    });
    const { value } = await Preferences.get({ key: 'dark' });

    if (value) {
      if (value === 'on') document.body.classList.add('dark');
      if (value === 'off') document.body.classList.remove('dark');

    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      console.log(prefersDark)

      await Preferences.set({
        key: 'dark',
        value: prefersDark.matches ? 'on' : 'off'
      });
      if (prefersDark) document.body.classList.add('dark');
      else document.body.classList.remove('dark');
    }
    

  }
}
