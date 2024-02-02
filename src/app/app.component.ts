import { Component } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet,  } from '@angular/router';
import { slider, stepper, transformer, fader } from './animation';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ // <-- add your animations here
  // fader,
  // slider,
  // transformer,
  // stepper
]

})
export class AppComponent {
  isCollapsed = false;

  constructor(private contexts: ChildrenOutletContexts) {}

  
prepareRoute(outlet: RouterOutlet) {
  return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
}

}
