import { style, animate, trigger, transition, state } from '@angular/animations';

export const transitionAnimationBtn = trigger('btnAnimate', [
  state('success', style({
    'max-width': '180px'
  })),
  state('primary', style({
    'max-width': '100px'
  })),
  transition('primary => success', [
    animate('.4s')
  ]),
  transition('success => primary', [
    animate('.2s')
  ])
]);