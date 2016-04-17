import * as _ from 'lodash'
import {Component} from 'angular2/core'
import {RouteParams} from 'angular2/router'
import {Observable} from 'rxjs/Observable'

import {BackButton} from 'shared/directives/BackButton'
import {SprintDocuments} from 'shared/services/SprintDocuments'
import {Sprints} from 'shared/services/Sprints'
import {ISprintData} from 'shared/reducers/sprint'
import {isSprintStartDate, getCards} from 'shared/helpers/sprint'
import {isToday} from 'shared/helpers/dates'
import {MomentPipe} from 'shared/pipes/MomentPipe'

import {SprintCardList} from './components/SprintCardList'


@Component({
  selector: 'sprint',
  template: require('./Sprint.jade')(),
  styles: [require('./Sprint.scss')],
  directives: [BackButton, SprintCardList],
  providers: [Sprints, SprintDocuments],
  pipes: [MomentPipe]
})
export class SprintComponent {
  public sprint: any = {}
  public lists: any = {}
  public completeCards: any[] = []
  public devCompleteCards: any[] = []
  public inProgressCards: any[] = []
  public unstartedCards: any[] = []
  public isCalculating: boolean = false
  public devCompletePoints: number = 0
  public completePoints: number = 0
  public inProgressPoints: number = 0
  public unstartedPoints: number = 0
  public sprintEstimates: Observable<string>
  public shouldShowEstimates: Observable<boolean>
  private _sprintId: number

  constructor(public sprints: Sprints, private _params: RouteParams, private _sprintDocuments: SprintDocuments) {
    this._sprintId = +_params.get('id')

    let sprint = sprints.items
      .map((items) => this._filterCurrentSprint(items))
      .map(_.first)
      .filter(item => !!item)
      .distinctUntilChanged()

    this.shouldShowEstimates = sprint
      .map((iSprint: ISprintData) => this._shouldShowEstimate(iSprint))

    this.sprintEstimates = sprint
      .filter((iSprint: ISprintData) => this._shouldShowEstimate(iSprint))
      .map((data: ISprintData) => this._createEstimatesBlob(data))

      sprint.subscribe((data: ISprintData) => {
        Object.assign(this, data)

        if (data.sprint.board)
          this._splitListIntoCards(data.sprint.board.lists)
      })

    this.sprints.find(this._sprintId)
  }

  private _splitListIntoCards(lists: any): void {
    if (!lists)
      return

    this.completeCards = getCards(lists.complete)
    this.unstartedCards = getCards(lists.unstarted)
    this.devCompleteCards = getCards(lists.devComplete)
    this.inProgressCards = getCards(lists.inProgress)
  }

  private _createEstimatesBlob(data: ISprintData): string {
    const {sprint} = data,
          sprintCSV = this._sprintDocuments.createEstimatesForBoard(sprint.board)

    return window.URL.createObjectURL(new File([sprintCSV], sprint.name, {type: 'text/csv'}))
  }

  private _shouldShowEstimate(data: ISprintData): boolean {
    const {sprint} = data

    if (sprint.board)
      return isToday(sprint.created)   ||
             isSprintStartDate(sprint) ||
             !this.inProgressPoints    &&
             !this.devCompletePoints   &&
             !!this.unstartedPoints
    else
      return false
  }

  private _filterCurrentSprint(items: ISprintData[]): ISprintData[] {
    return items
      .filter(({sprint}: ISprintData) => sprint && sprint.id === this._sprintId)
  }
}

