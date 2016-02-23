import {Component} from 'angular2/core'
import {BackButton} from 'directives/backButton'
import {Observable} from 'rxjs/Observable'
import {SprintApi} from 'api/sprint'
import {RouterLink, Router} from 'angular2/router'

@Component({
  selector: 'sprints',
  template: require('./sprints.jade')(),
  styles: [require('./sprints.scss')],
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
