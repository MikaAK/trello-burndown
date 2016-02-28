import {Injectable} from 'angular2/core'
import {ApiService, ApiResource} from 'angular2-api'

@Injectable()
export class TeamMemberApi implements ApiResource {
  public endpoint: string = 'team-members'

  constructor(private _api: ApiService) {
    _api.initialize(this)
  }
}

