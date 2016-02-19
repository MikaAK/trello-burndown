import {Component} from 'angular2/core'
import {Modal, ModalConfig} from 'directives/modal'
import {NewSprintComponent} from './newSprint'

@Component({
  selector: 'home',
  template: require('./home.jade')(),
  directives: [Modal, NewSprintComponent]
})
export class HomeComponent {
  public greeting: string
  public modal: ModalConfig

  constructor() {
    this.greeting = 'webpack-ng2-seed'
    this.modal = new ModalConfig()
  }
}
