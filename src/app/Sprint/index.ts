import * as _ from 'lodash'
import {Component} from 'angular2/core'
import {RouteParams} from 'angular2/router'
import {Observable} from 'rxjs/Observable'

import {BackButton} from 'shared/directives/BackButton'
import {SprintDocuments} from 'shared/services/SprintDocuments'
import {Sprints} from 'shared/services/Sprints'
import {ISprintData} from 'shared/reducers/sprint'

import {SprintCardList} from './components/SprintCardList'


@Component({
  selector: 'sprint',
  template: require('./Sprint.jade')(),
  styles: [require('./Sprint.scss')],
  directives: [BackButton, SprintCardList],
  providers: [Sprints, SprintDocuments]
})
export class SprintComponent {
  public sprint: any = {}
  public isCalculating: boolean = false
  public sprintEstimates: Observable<string>
  public shouldShowEstimates: Observable<boolean>
  private _sprintId: number

  constructor(public sprints: Sprints, private _params: RouteParams, private _sprintDocuments: SprintDocuments) {
    this._sprintId = +_params.get('id')

    let sprint = sprints.items
      .map((items) => this._filterCurrentSprint(items))
      .map(_.first)
      .filter(item => !!item)

    this.sprintEstimates = sprint
      .map((data: ISprintData) => this._createEstimatesBlob(data))

    this.shouldShowEstimates = sprint
      .map((data: ISprintData) => data.sprint)
      .map(iSprint => !iSprint.completedPoints && !iSprint.devCompletedPoints)

    sprint.subscribe((data: ISprintData) => Object.assign(this, data))

    this.sprints.find(this._sprintId)
  }

  private _createEstimatesBlob(data: ISprintData): string {
    const {sprint} = data,
          sprintCSV = this._sprintDocuments.createEstimatesForBoard(sprint.board)

    return window.URL.createObjectURL(new File([sprintCSV], sprint.name, {type: 'text/csv'}))
  }

  private _filterCurrentSprint(items: ISprintData[]): ISprintData[] {
    return items
      .filter(({sprint}: ISprintData) => sprint && sprint.id === this._sprintId)
  }
}

