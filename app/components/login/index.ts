import {Component} from 'angular2/core'
import {TrelloApi} from 'api/trello'

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
