import {Component} from 'angular2/core'

@Component({
  selector: 'back-button',
  template: require('./backButton.jade')()
})
export class BackButton {
  public goBack() {
    history.back()
  }
}
