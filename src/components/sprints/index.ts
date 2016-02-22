import {Component} from 'angular2/core'
import {BackButton} from 'directives/backButton'
import {Observable} from 'rxjs/Observable'
import {SprintApi} from 'api/sprint'

@Component({
  selector: 'sprints',
  template: require('./sprints.jade')(),
  styles: [require('./sprints.scss')],
  directives: [BackButton]
})
export class SprintsComponent {
  public sprints: any[]
  private fetchSprints: Observable<any>

  constructor(public sprint: SprintApi) {
    this.fetchSprints = this.sprint.findAll()

    this.getSprints()
  }

  public getSprints() {
    this.fetchSprints.subscribe(sprints => (this.sprints = sprints, console.log(sprints)))
  }
}
