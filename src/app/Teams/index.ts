import {Component} from 'angular2/core'
import {Router} from 'angular2/router'
import {Observable} from 'rxjs/Observable'

import {Teams} from 'shared/services/Teams'
import {TrelloApi} from 'api/Trello'
import {BackButton} from 'shared/directives/BackButton'
import {NewTeam} from './components/NewTeam'

@Component({
  selector: 'teams',
  template: require('./Teams.jade')(),
  styles: [require('./Teams.scss')],
  directives: [BackButton, NewTeam],
  providers: [TrelloApi, Teams]
})
export class TeamsComponent {
  constructor(public teams: Teams) {
    teams.findAll()
  }
}
