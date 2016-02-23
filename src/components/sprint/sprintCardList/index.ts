import {Component, Input} from 'angular2/core'

@Component({
  selector: 'sprint-card-list',
  template: require('./sprintCardList.jade')(),
})
export class SprintCardList {
  @Input() public cards: any[]
}
