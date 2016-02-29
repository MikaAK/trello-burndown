import {Injectable} from 'angular2/core'
import {Observable} from 'rxjs/Observable'
import {TeamMemberApi} from './TeamMember'
import {ApiService, ApiResource} from 'angular2-api'

@Injectable()
export class TeamApi implements ApiResource {
  public endpoint: string = 'team'

  constructor(private _api: ApiService, public teamMemberApi: TeamMemberApi) {}

  public create(data: any, params?: Object): Observable<any> {
    return this._api.create(this, {name: data.name})
      .mergeMap(team => {
        var teamMembers = data.teamMembers
          .map(function(teamMember) {
            teamMember.teamId = team.id
            teamMember.admin = false

            return teamMember
          })
          .map(teamMember => this._api.create(this.teamMemberApi, teamMember))

        return Observable.forkJoin(teamMembers)
      })
  }
}
