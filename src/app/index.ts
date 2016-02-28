import {Component} from 'angular2/core'
import {RouteConfig, RouterOutlet, Router} from 'angular2/router'
import {Observable} from 'rxjs/Observable'
import {load} from 'webfontloader'

import {API_PROVIDERS} from 'api'
import {TrelloApi} from 'api/Trello'

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
  { path: '/', component: HomeComponent, name: 'Home', useAsDefault: true },
  { path: '/login', component: LoginComponent, name: 'Login' },
  { path: '/teams', component: TeamsComponent, name: 'Teams' },
  { path: '/sprints', component: SprintsComponent, name: 'Sprints' },
  { path: '/sprint/:id', component: SprintComponent, name: 'Sprint' },
  { path: '/**', redirectTo: ['Home'] }
])
export class AppComponent {
  constructor(private _trelloApi: TrelloApi, private _router: Router) {}

  public ngOnInit() {
    this._router.subscribe(route => {
      var isAuthorized = this._trelloApi.isAuthorized()

      if (route !== 'login' && !isAuthorized)
        this._router.navigate(['Login'])
      else if (route === 'login' && isAuthorized)
        this._router.navigate(['Home'])
    })

    return new Promise(function(resolve, reject) {
      load({
        google: {
          families: ['Lato', 'Montserrat']
        },
        active: resolve,
        inactive: reject
      })
    })
  }
}
