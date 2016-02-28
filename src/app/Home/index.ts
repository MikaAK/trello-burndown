import {Component} from 'angular2/core'
import {NewSprintComponent} from './NewSprint'
import {NavBar} from 'shared/directives/NavBar'

@Component({
  selector: 'home',
  template: require('./Home.jade')(),
  styles: [require('./Home.scss')],
  directives: [NewSprintComponent, NavBar]
})
export class HomeComponent {
}
