import {Component} from 'angular2/core'
import {Router} from 'angular2/router'
import {Modal, ModalConfig} from 'directives/modal'
import {NewSprintComponent} from './newSprint'
import {TrelloApi} from 'api/trello'

@Component({
  selector: 'home',
  template: require('./home.jade')(),
  directives: [Modal, NewSprintComponent],
  providers: [TrelloApi]
})
export class HomeComponent {
  public greeting: string
  public modal: ModalConfig

  constructor(private router: Router, private trello: TrelloApi) {
    this.greeting = 'webpack-ng2-seed'
    this.modal = new ModalConfig()
  }

  public ngOnInit() {
    if (!this.trello.isAuthorized())
      this.router.navigate(['Login'])
  }
}
