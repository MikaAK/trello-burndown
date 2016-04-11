import {Injectable} from 'angular2/core'
import {Observable} from 'rxjs/Observable'

import {ApiService} from 'angular2-api'

import {SprintApi} from 'api/Sprint'
import {TrelloApi} from 'api/Trello'
import {newSprintToCSV} from 'shared/helpers/sprint'

@Injectable()
export class SprintDocuments {
  constructor(private _apiService: ApiService, private _trelloApi: TrelloApi, private _sprintApi: SprintApi) {}

  public createEstimatesForSprint(sprintId: string|number): Observable<string> {
    return this._apiService.find(this._sprintApi, sprintId)
      .mergeMap(sprint => this._trelloApi.getBoard(sprint.boardId))
      .map(board => this.createEstimatesForBoard(board))
  }

  public createEstimatesForBoard(board: any): string {
    return newSprintToCSV(board.lists)
  }
}
