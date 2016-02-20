import {Component} from 'angular2/core'
import {RouteConfig, RouterOutlet} from 'angular2/router'

import {HomeComponent} from './home'
import {LoginComponent} from './login'

import {load} from 'webfontloader'

@Component({
  selector: 'app',
  template: require('./app.jade')(),
  styles: [require('./app.scss')],
  directives: [RouterOutlet]
})
@RouteConfig([
  { path: '/', component: HomeComponent, name: 'Home' },
  { path: '/login', component: LoginComponent, name: 'Login' },
  { path: '/**', redirectTo: ['Home'] }
])
export class AppComponent {
  public ngOnInit() {
    return new Promise(function(resolve, reject) {
      load({
        google: {
          families: ['Lato', 'Droid Serif']
        },
        active() {
          resolve()
        },
        inactive() {
          reject()
        }
      })
    })
  }
}
