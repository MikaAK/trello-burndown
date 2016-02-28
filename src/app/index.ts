import {Component} from 'angular2/core'
import {RouteConfig, RouterOutlet} from 'angular2/router'
import {Observable} from 'rxjs/Observable'
import {load} from 'webfontloader'

import {API_PROVIDERS} from 'api'

import {HomeComponent} from './home'
import {LoginComponent} from './login'
import {TeamsComponent} from './teams'
import {SprintsComponent} from './sprints'
import {SprintComponent} from './sprint'

@Component({
  selector: 'app',
  template: require('./app.jade')(),
  styles: [require('./app.scss')],
  directives: [RouterOutlet],
  providers: API_PROVIDERS
})
@RouteConfig([
  { path: '/', component: HomeComponent, name: 'Home' },
  { path: '/login', component: LoginComponent, name: 'Login' },
  { path: '/teams', component: TeamsComponent, name: 'Teams' },
  { path: '/sprints', component: SprintsComponent, name: 'Sprints' },
  { path: '/sprint/:id', component: SprintComponent, name: 'Sprint' },
  { path: '/**', redirectTo: ['Home'] }
])
export class AppComponent {
  public ngOnInit() {
    return new Observable(function(observer) {
      load({
        google: {
          families: ['Lato', 'Montserrat']
        },
        active() {
          observer.next()
          observer.complete()
        },
        inactive() {
          observer.error()
          observer.complete()
        }
      })
    })
  }
}
