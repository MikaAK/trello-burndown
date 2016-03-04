import {first} from 'lodash'
import {ApiResource, ApiService} from 'angular2-api'
import {Injectable} from 'angular2/core'
import {TrelloApi} from './Trello'
import {Observable} from 'rxjs/Observable'

@Injectable()
export class SprintApi implements ApiResource {
  public endpoint: string = 'sprints'

  constructor(private _api: ApiService, private _trello: TrelloApi) {}

  public create(data: any, params?: Object): Observable<any> {
    return this._trello.getBoard(data.boardId)
      .catch(error => Observable.throw(error.text ? error.text() : error))
      .map(board => {
        data.sprintName = first(board.name.match(/Sprint +\W +(.*)/)) || board.name

        return data
      })
      .mergeMap(sprint => this._api.create(this, sprint))
  }
}

