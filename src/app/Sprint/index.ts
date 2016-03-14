import * as _ from 'lodash'
import {Component} from 'angular2/core'
import {RouteParams} from 'angular2/router'
import {BackButton} from 'shared/directives/BackButton'
import {SprintCardList} from './components/SprintCardList'
import {Sprints} from 'shared/services/Sprints'


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
    sprints.items
      .map(_.first)
      .filter(sprint => sprint && sprint.id === +params.get('id'))
      .subscribe(sprint => this.sprint = sprint)

    this.sprints.find(params.get('id'))
  }
}

