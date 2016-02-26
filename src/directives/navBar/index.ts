import {Component} from 'angular2/core'
import {Router, RouterLink} from 'angular2/router'

@Component({
  selector: 'nav-bar',
  template: require('./navBar.jade')(),
  styles: [require('./navBar.scss')],
  directives: [RouterLink]
})

export class NavBar {
  constructor(private _router: Router) {
  }
}
