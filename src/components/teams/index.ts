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

  constructor(private router: Router, private trello: TrelloApi, private team: TeamApi) {
    this.teamFetch = this.team.findAll()

    this.fetchTeams()
  }

  public ngOnInit() {
    if (!this.trello.isAuthorized())
      this.router.navigate(['Login'])
  }

  public fetchTeams() {
    this.teamFetch.subscribe(teams => this.teams = teams)
  }
}
