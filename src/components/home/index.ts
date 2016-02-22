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
  public greeting: string

  constructor(private router: Router, private trello: TrelloApi) {
    this.greeting = 'webpack-ng2-seed'
  }

  public ngOnInit() {
    if (!this.trello.isAuthorized())
      this.router.navigate(['Login'])
  }
}
