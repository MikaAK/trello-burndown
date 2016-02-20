import {Router} from 'angular2/router'
import {Component} from 'angular2/core'
import {TrelloApi} from 'api/trello'

@Component({
  selector: 'login',
  template: require('./login.jade')(),
  providers: [TrelloApi]
})
export class LoginComponent {
  constructor(private trello: TrelloApi, private router: Router) {}

  public ngOnInit() {
    if (this.trello.isAuthorized()) {
      this.navigateHome()

      return false
    }
  }

  public authorize() {
    this.trello.getAuthorization()
      .subscribe(() => this.navigateHome())
  }

  private navigateHome() {
      this.router.navigate(['Home'])
  }
}
