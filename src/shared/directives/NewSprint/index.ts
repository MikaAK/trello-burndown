import * as _ from 'lodash'
import {Component, Output, EventEmitter} from 'angular2/core'
import {Modal, ModalConfig} from 'shared/directives/Modal'
import {FormSave} from 'shared/directives/FormSave'
import {TeamApi} from 'api/Team'
import {SprintApi} from 'api/Sprint'
import {Observable} from 'rxjs/Observable'
import {NewSprintModel} from './NewSprintModel'

interface ISprint {
  team: any,
  boardId: string,
  holidays: string,
  teamId?: number
}

const DEFAULT_SPRINT: ISprint = {
  team: null,
  boardId: '',
  holidays: ''
}

@Component({
  selector: 'new-sprint',
  template: require('./NewSprint.jade')(),
  styles: [require('./NewSprint.scss')],
  directives: [FormSave, Modal],
  providers: [NewSprintModel]
})
export class NewSprint {
  @Output() public onSave: EventEmitter<any> = new EventEmitter()
  @Output() public onCancel: EventEmitter<any> = new EventEmitter()

  public modal: ModalConfig
  public sprint: ISprint

  constructor(public newSprint: NewSprintModel) {
    debugger
    this.modal = new ModalConfig()
    this.sprint = DEFAULT_SPRINT
  }

  public save() {
    //debugger
    //var holidays = this.sprint.holidays
      //.split(',')
      //.map(str => str.trim())

    //var params = {
      //holidays,
      //teamId: _.find(this.newSprint.teams., {name: this.sprint.team}).id,
      //boardId: this.newSprint.boardId
    //}

    //this.home.createSprint(this.sprint)
  }

  public cancel() {
    this.sprint = DEFAULT_SPRINT
    this.onCancel.emit('event')
  }
}
