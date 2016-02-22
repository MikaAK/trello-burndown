import {Injectable} from 'angular2/core'
import {Http} from 'angular2/http'
import {RestApi} from './lib/RestApi'

@Injectable()
export class TeamMemberApi extends RestApi {
  public endpoint: string = 'team-members'

  constructor(public http: Http) {super(http)}
}

