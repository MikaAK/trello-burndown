import {Component} from 'angular2/core'
import {RouteConfig, RouterOutlet, Router, Location} from 'angular2/router'
import {Observable} from 'rxjs/Observable'
import {Store} from '@ngrx/store'
import {load} from 'webfontloader'

import {TrelloApi} from 'api/Trello'
import {NavBar} from 'shared/directives/NavBar'
import {Auth} from 'shared/services/Auth'

import {HomeComponent} from './home'
import {LoginComponent} from './login'
import {TeamsComponent} from './teams'
import {SprintsComponent} from './sprints'
import {SprintComponent} from './sprint'

@Component({
  selector: 'app',
  template: require('./app.jade')(),
  styles: [require('./app.scss')],
  directives: [RouterOutlet, NavBar],
  providers: [Auth]
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
  constructor(private _router: Router, private _location: Location, public auth: Auth) {
    setTimeout(() => auth.checkAuth(), 1000)
  }
    

  public ngOnInit() {
    var isFirst = true

    this.auth.isAuthorized
      .subscribe((isAuthorized: boolean) => {
        if (isFirst)
          return isFirst = false

        const isLogin = /login/.test(this._location.path())

        if (isAuthorized && !isLogin)
          return

        if (isLogin && isAuthorized)
          this._router.navigate(['Home'])
        else
          this._router.navigate(['Login'])
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
