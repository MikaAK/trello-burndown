import {Component} from 'angular2/core'
import {RouteConfig, RouterOutlet} from 'angular2/router'

import {HomeComponent} from './home'

@Component({
  selector: 'app',
  template: require('./app.jade')(),
  styles: [require('./app.css')],
  directives: [RouterOutlet]
})
@RouteConfig([
  { path: '/', component: HomeComponent, name: 'Index' },
  { path: '/**', redirectTo: ['Index'] }
])
export class AppComponent {
}
