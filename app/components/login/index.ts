import {Component, Injector} from 'angular2/core'
import {CanActivate} from 'angular2/router'
import {TrelloApi} from 'api/trello'
import {Http} from 'angular2/http'

@CanActivate(function() {
  var injector = Injector.resolveAndCreate([
    TrelloApi, Http
  ])

  var trello = injector.get(TrelloApi)
  debugger

  return !trello.isAuthorized()
})
@Component({
  selector: 'login',
  template: require('./login.jade')(),
  providers: [TrelloApi]
})
export class LoginComponent {
  constructor(private trello: TrelloApi) {}

  public authorize() {
    this.trello.getAuthorization()
      .subscribe(function(key) {
        console.log(key)
      })
  }
}
