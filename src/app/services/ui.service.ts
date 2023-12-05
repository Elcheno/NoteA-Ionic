import { Injectable,inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular/standalone';
import { ActionSheetController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UIService {

  private loadingC = inject(LoadingController);
  private toastC = inject(ToastController);
  private ascService = inject(ActionSheetController);

  private loadingElement!:HTMLIonLoadingElement | undefined;

  constructor() { }

  showLoading(msg?: string): Promise<void> {
    return new Promise(async (resolve,reject)=> {
      if (this.loadingElement) {
        resolve();
      } else {
        this.loadingElement = await this.loadingC.create({message: msg});
        this.loadingElement.present();
        resolve();
      }
    })
  }

  async hideLoading(): Promise<void> {
    if (!this.loadingElement) return;
    await this.loadingElement.dismiss();
    this.loadingElement = undefined;
  }

  async showToast(msg: string,
      color: string = 'primary',
      duration: number = 3000,
      position: "top" | "bottom" | "middle" | undefined="bottom"
      ): Promise<void> {
    let toast: HTMLIonToastElement = await this.toastC.create({
      message: msg,
      duration: duration,
      position: position,
      color: color,
      translucent: true
    });

    toast.present();
  }

  async dismissQuestion(msg: string): Promise<string | undefined> {
    const actionSheet = await this.ascService.create({
      header: msg,
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();
    
    const { role } = await actionSheet.onWillDismiss();

    return role;
  };
}
