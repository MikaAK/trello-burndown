import {Injectable} from 'angular2/core'
import {TeamMemberApi} from './TeamMember'
import {ApiService, ApiResource} from 'angular2-api'

@Injectable()
export class TeamApi implements ApiResource {
  public endpoint: string = 'team'

  constructor(private _api: ApiService, public teamMemberApi: TeamMemberApi) {}
}
