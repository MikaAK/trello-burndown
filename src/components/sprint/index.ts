import {Component} from 'angular2/core'
import {RouteParams} from 'angular2/router'
import {BackButton} from 'directives/backButton'
import {Observable} from 'rxjs/Observable'
import {SprintApi} from 'api/sprint'

@Component({
  selector: 'sprint',
  template: require('./sprint.jade')(),
  styles: [require('./sprint.scss')],
  directives: [BackButton]
})
export class SprintComponent {
  public sprint: any
  private fetchSprint: Observable<any>

  constructor(private _sprint: SprintApi, routeParams: RouteParams) {
    this.fetchSprint = this._sprint.find(+routeParams.get('id'))

    this.getSprint()
  }

  public getSprint(): void {
    this.fetchSprint.subscribe(sprint => {
      sprint.teamName = sprint.team ? sprint.team.name : ''

      this.sprint = sprint
    })
  }
}

