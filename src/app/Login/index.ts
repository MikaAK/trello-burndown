import {Router} from 'angular2/router'
import {Component} from 'angular2/core'
import {TrelloApi} from 'api/Trello'

@Component({
  selector: 'login',
  template: require('./Login.jade')(),
  styles: [require('./Login.scss')],
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
