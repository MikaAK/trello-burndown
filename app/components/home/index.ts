import {Component} from 'angular2/core'
import {ModalComponent} from 'directives/modal' 

@Component({
  selector: 'home',
  template: require('./home.jade')(),
  directives: [ModalComponent]
})
export class HomeComponent {
  public greeting: string,

  constructor() {
    this.greeting = 'webpack-ng2-seed'
  }
}
