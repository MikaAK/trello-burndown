import {Component} from 'angular2/core'
import {Router, RouterLink} from 'angular2/router'

@Component({
  selector: 'nav-bar',
  template: require('./NavBar.jade')(),
  styles: [require('./NavBar.scss')],
  directives: [RouterLink]
})

export class NavBar {
  constructor(private _router: Router) {
  }
}
