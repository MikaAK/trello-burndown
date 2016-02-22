import {Injectable} from 'angular2/core'
import {Http} from 'angular2/http'
import {RestApi} from './lib/RestApi'
import {TrelloApi} from './trello'
import {Observable} from 'rxjs/Observable'

@Injectable()
export class SprintApi extends RestApi {
  public endpoint: string = 'sprints'

  constructor(public http: Http, public trello: TrelloApi) {super(http)}

  public create(data: any, params?: Object): Observable<any> {
    return this.trello.getBoard(data.boardId)
      .map(board => {
        data.sprintName = board.name.match(/Sprint +\W +(.*)/)[1] || board.name

        return data
      })
      .mergeMap(sprint => super.create(sprint))
  }
}

