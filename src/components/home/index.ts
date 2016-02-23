import {Component} from 'angular2/core'
import {Router, RouterLink} from 'angular2/router'
import {NewSprintComponent} from './newSprint'
import {TrelloApi} from 'api/trello'

@Component({
  selector: 'home',
  template: require('./home.jade')(),
  styles: [require('./home.scss')],
  directives: [NewSprintComponent, RouterLink]
})
export class HomeComponent {
  constructor(private _router: Router, private _trello: TrelloApi) {
  }

  public ngOnInit() {
    if (!this._trello.isAuthorized())
      this._router.navigate(['Login'])
  }
}
