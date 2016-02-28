import {Component} from 'angular2/core'
import {Observable} from 'rxjs/Observable'
import {SprintApi} from 'api/Sprint'
import {RouterLink, Router} from 'angular2/router'
import {BackButton} from 'shared/directives/BackButton'

@Component({
  selector: 'sprints',
  template: require('./Sprints.jade')(),
  styles: [require('./Sprints.scss')],
  directives: [BackButton, RouterLink]
})
export class SprintsComponent {
  public sprints: any[]
  private fetchSprints: Observable<any>

  constructor(private _sprint: SprintApi, public router: Router) {
    this.fetchSprints = this._sprint.findAll()

    this.getSprints()
  }

  public getSprints() {
    this.fetchSprints.subscribe(sprints => this.sprints = sprints)
  }
}
