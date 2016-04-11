import {Component} from 'angular2/core'
import {RouterLink, Router} from 'angular2/router'

import {BackButton} from 'shared/directives/BackButton'
import {Sprints} from 'shared/services/Sprints'
import {MomentPipe} from 'shared/pipes/MomentPipe'

import {ROUTES} from 'app/routes'

@Component({
  selector: 'sprints',
  template: require('./Sprints.jade')(),
  styles: [require('./Sprints.scss')],
  directives: [BackButton, RouterLink],
  providers: [Sprints],
  pipes: [MomentPipe]
})
export class SprintsComponent {
  public ROUTES = ROUTES
  constructor(public router: Router, public sprints: Sprints) {
    sprints.findAll()
  }
}
