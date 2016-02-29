import {Component} from 'angular2/core'
import {NewSprint} from 'shared/directives/NewSprint'

@Component({
  selector: 'home',
  template: require('./Home.jade')(),
  styles: [require('./Home.scss')],
  directives: [NewSprint]
})
export class HomeComponent {
}
