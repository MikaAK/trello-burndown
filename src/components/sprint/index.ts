import * as _ from 'lodash'
import {Component} from 'angular2/core'
import {RouteParams} from 'angular2/router'
import {BackButton} from 'directives/backButton'
import {Observable} from 'rxjs/Observable'
import {SprintApi} from 'api/sprint'
import {TrelloApi} from 'api/trello'
import {SprintCardList} from './sprintCardList'

var getCards = function(lists: any[]): any[] {
  return _(lists)
    .map('cards')
    .flatten()
    .compact()
    .filter(card => _.some(card.labels))
    .value()
}

@Component({
  selector: 'sprint',
  template: require('./sprint.jade')(),
  styles: [require('./sprint.scss')],
  directives: [BackButton, SprintCardList]
})
export class SprintComponent {
  public sprint: any = {}
  private fetchSprint: Observable<any>

  constructor(private _sprint: SprintApi, private _trello: TrelloApi, routeParams: RouteParams) {
    this.fetchSprint = this._sprint.find(+routeParams.get('id'))
      .mergeMap(sprint => this._getTrelloBoard(sprint))
      .map(sprint => this._splitCards(sprint))

    this.getSprint()
  }

  public getSprint(): void {
    this.fetchSprint
      .subscribe(sprint => this.sprint = sprint)
  }

  private _getTrelloBoard(sprint): Observable<any> {
    return this._trello.getFullBoard(sprint.boardId)
      .map(board => {
        sprint.board = board
        sprint.teamName = sprint.team ? sprint.team.name : ''

        return sprint
      })
  }

  private _splitCards(sprint: any) {
    var completedLists: any[] = sprint.board.lists
      .filter(list => /done!/i.test(list.name))

    var devCompletedLists: any[] = sprint.board.lists
      .filter(list => /signoff|completed|stage/i.test(list.name))

    var uncompletedLists = _.without(sprint.board.lists, ...completedLists, ...devCompletedLists)
      .filter(list => !/defered/i.test(list.name))

    sprint.completedCards = getCards(completedLists)
    sprint.uncompletedCards = getCards(uncompletedLists)
    sprint.devCompletedCards = getCards(devCompletedLists)

    return sprint
  }
}

