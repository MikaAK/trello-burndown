import * as _ from 'lodash'
import {Component} from 'angular2/core'
import {RouteParams} from 'angular2/router'
import {BackButton} from 'shared/directives/BackButton'
import {Observable} from 'rxjs/Observable'
import {SprintApi} from 'api/Sprint'
import {TrelloApi} from 'api/Trello'
import {SprintCardList} from './SprintCardList'


const getCards = function(lists: any[], onlyPointed = true): any[] {
  return _(lists)
    .map('cards')
    .flatten()
    .compact()
    .filter(card: Object => !onlyPointed || card.points)
    .value()
}

const calculatePoints = function(cards: any[]): number {
  return _(cards)
    .map('points')
    .sum()
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

    var bugLists: any[] = sprint.board.lists
      .filter(list => /bugs?/i.test(list.name) && !/extra/.test(list.name))

    var uncompletedLists: any[] = _.without(sprint.board.lists, ...completedLists, ...devCompletedLists, ...bugLists)
      .filter(list => !/defered/i.test(list.name))

    sprint.completedCards = getCards(completedLists)
    sprint.completedPoints = calculatePoints(sprint.completedCards)

    sprint.uncompletedCards = getCards(uncompletedLists)
    sprint.uncompletedPoints = calculatePoints(sprint.uncompletedCards)

    sprint.devCompletedCards = getCards(devCompletedLists)
    sprint.devCompletedPoints = calculatePoints(sprint.devCompletedCards)

    sprint.bugCards = getCards(bugLists, false)

    sprint.totalPoints = sprint.devCompletedPoints + sprint.uncompletedPoints + sprint.completedPoints

    return sprint
  }
}

