import {Injectable} from 'angular2/core'
import {Http} from 'angular2/http'
import {RestApi} from './lib/RestApi'
import {Observable} from 'rxjs/Observable'
import {TeamMemberApi} from './teamMember'

@Injectable()
export class TeamApi extends RestApi {
  public endpoint: string = 'team'

  constructor(public http: Http, public teamMember: TeamMemberApi) {super(http)}

  public create(data: any, params?: Object): Observable<any> {
    return super.create({name: data.name})
      .mergeMap(team => {
        var teamMembers = data.teamMembers
          .map(function(teamMember) {
            teamMember.teamId = team.id
            teamMember.admin = false

            return teamMember
          })
          .map(teamMember => this.teamMember.create(teamMember))

        return Observable.forkJoin(teamMembers)
      })
  }
}
