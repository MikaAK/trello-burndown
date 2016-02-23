import {Component} from 'angular2/core'
import {Router} from 'angular2/router'
import {TrelloApi} from 'api/trello'
import {TeamApi} from 'api/team'
import {BackButton} from 'directives/backButton'
import {NewTeam} from './newTeam'
import {Observable} from 'rxjs/Observable'

@Component({
  selector: 'teams',
  template: require('./teams.jade')(),
  styles: [require('./teams.scss')],
  directives: [BackButton, NewTeam],
  providers: [TrelloApi, TeamApi]
})
export class TeamsComponent {
  public teams: any
  private teamFetch: Observable<any>

  constructor(private _router: Router, private _trello: TrelloApi, private _team: TeamApi) {
    this.teamFetch = this._team.findAll()

    this.fetchTeams()
  }

  public ngOnInit() {
    if (!this._trello.isAuthorized())
      this._router.navigate(['Login'])
  }

  public fetchTeams() {
    this.teamFetch.subscribe(teams => this.teams = teams)
  }
}
