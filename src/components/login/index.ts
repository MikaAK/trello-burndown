import {Router} from 'angular2/router'
import {Component} from 'angular2/core'
import {TrelloApi} from 'api/trello'

@Component({
  selector: 'login',
  template: require('./login.jade')(),
  styles: [require('./login.scss')],
})
export class LoginComponent {
  constructor(private _trello: TrelloApi, private _router: Router) {}

  public ngOnInit() {
    if (this._trello.isAuthorized()) {
      this.navigateHome()

      return false
    }
  }

  public authorize() {
    this._trello.getAuthorization()
      .subscribe(() => this.navigateHome())
  }

  private navigateHome() {
      this._router.navigate(['Home'])
  }
}
