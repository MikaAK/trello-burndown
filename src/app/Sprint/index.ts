import * as _ from 'lodash'
import {Component} from 'angular2/core'
import {RouteParams} from 'angular2/router'
import {BackButton} from 'shared/directives/BackButton'
import {SprintCardList} from './components/SprintCardList'
import {Sprints} from 'shared/services/Sprints'
import {ISprintData} from 'shared/reducers/sprint'


@Component({
  selector: 'sprint',
  template: require('./Sprint.jade')(),
  styles: [require('./Sprint.scss')],
  directives: [BackButton, SprintCardList],
  providers: [Sprints]
})
export class SprintComponent {
  public sprint: any = {}
  public isCalculating: boolean = false
  private _sprintId: number

  constructor(public sprints: Sprints, params: RouteParams) {
    this._sprintId = +params.get('id')

    sprints.items
      .map((items) => this._filterCurrentSprint(items))
      .map(_.first)
      .filter(item => !!item)
      .subscribe((data: ISprintData) => Object.assign(this, data))

    this.sprints.find(this._sprintId)
  }

  private _filterCurrentSprint(items: ISprintData[]) {
    return items
      .filter(({sprint}: ISprintData) => sprint && sprint.id === this._sprintId)
  }
}

