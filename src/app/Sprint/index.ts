import * as _ from 'lodash'
import {Component} from 'angular2/core'
import {RouteParams} from 'angular2/router'
import {BackButton} from 'shared/directives/BackButton'
import {Observable} from 'rxjs/Observable'
import {SprintCardList} from './components/SprintCardList'
import {Sprints} from 'shared/services/Sprints'


//const getCards = function(lists: any[], onlyPointed = true): any[] {
  //return _(lists)
    //.map('cards')
    //.flatten()
    //.compact()
    //.filter(card: Object => !onlyPointed || card.points)
    //.value()
//}

//const calculatePoints = function(cards: any[]): number {
  //return _(cards)
    //.map('points')
    //.sum()
//}

@Component({
  selector: 'sprint',
  template: require('./Sprint.jade')(),
  styles: [require('./Sprint.scss')],
  directives: [BackButton, SprintCardList],
  providers: [Sprints]
})
export class SprintComponent {
  public sprint: any = {}

  constructor(public sprints: Sprints, params: RouteParams) {
    //this.fetchSprint = this._sprint.find(+routeParams.get('id'))
      //.mergeMap(sprint => this._getTrelloBoard(sprint))
      //.map(sprint => this._splitCards(sprint))
    sprints.items
      .map(_.first)
      .filter(sprint => sprint && sprint.id === +params.get('id'))
      .subscribe(sprint => this.sprint = sprint)

    this.sprints.find(params.get('id'))
  }

  //private _getTrelloBoard(sprint): Observable<any> {
    //return this._trello.getFullBoard(sprint.boardId)
      //.map(board => {
        //sprint.board = board
        //sprint.teamName = sprint.team ? sprint.team.name : ''

        //return sprint
      //})
  //}

  //private _splitCards(sprint: any) {
    //var completedLists: any[] = sprint.board.lists
      //.filter(list => /done!/i.test(list.name))

    //var devCompletedLists: any[] = sprint.board.lists
      //.filter(list => /signoff|completed|stage/i.test(list.name))

    //var bugLists: any[] = sprint.board.lists
      //.filter(list => /bugs?/i.test(list.name) && !/extra/.test(list.name))

    //var uncompletedLists: any[] = _.without(sprint.board.lists, ...completedLists, ...devCompletedLists, ...bugLists)
      //.filter(list => !/defered/i.test(list.name))

    //sprint.completedCards = getCards(completedLists)
    //sprint.completedPoints = calculatePoints(sprint.completedCards)

    //sprint.uncompletedCards = getCards(uncompletedLists)
    //sprint.uncompletedPoints = calculatePoints(sprint.uncompletedCards)

    //sprint.devCompletedCards = getCards(devCompletedLists)
    //sprint.devCompletedPoints = calculatePoints(sprint.devCompletedCards)

    //sprint.bugCards = getCards(bugLists, false)

    //sprint.totalPoints = sprint.devCompletedPoints + sprint.uncompletedPoints + sprint.completedPoints

    //return sprint
  //}
}

