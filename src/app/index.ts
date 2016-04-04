require('style/global.scss')
import {Component} from 'angular2/core'
import {RouteConfig, RouterOutlet, Router, Location} from 'angular2/router'
import {load} from 'webfontloader'
import {Devtools} from '@ngrx/devtools'

import {NavBar} from 'shared/directives/NavBar'
import {Auth} from 'shared/services/Auth'
import {TeamsSocket} from 'shared/socket/TeamsSocket'

import {HomeComponent} from './Home'
import {LoginComponent} from './Login'
import {TeamsComponent} from './Teams'
import {SprintsComponent} from './Sprints'
import {SprintComponent} from './Sprint'
import {APP_PROVIDERS} from './AppProviders'

@Component({
  selector: 'app',
  template: require('./app.jade')(),
  styles: [require('./app.scss')],
  directives: [RouterOutlet, NavBar, Devtools],
  providers: APP_PROVIDERS
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
  constructor(
    private _router: Router,
    private _location: Location,
    private teamsSocket: TeamsSocket,
    public auth: Auth
  ) {
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
