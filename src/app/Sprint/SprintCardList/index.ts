import {Component, Input} from 'angular2/core'

@Component({
  selector: 'sprint-card-list',
  template: require('./SprintCardList.jade')(),
  styles: [require('./SprintCardList.scss')],
})
export class SprintCardList {
  @Input() public cards: any[]
}
