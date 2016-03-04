import * as _ from 'lodash'
import {Component, Output, EventEmitter} from 'angular2/core'
import {FormBuilder, Validators, ControlGroup, NgForm} from 'angular2/common'
import {Modal, ModalConfig} from 'shared/directives/Modal'
import {FormSave} from 'shared/directives/FormSave'
import {TeamApi} from 'api/Team'
import {SprintApi} from 'api/Sprint'
import {Observable} from 'rxjs/Observable'
import {NewSprintModel} from './NewSprintModel'
import {ErrorDisplay} from '../ErrorDisplay'

interface ISprint {
  team: any,
  boardId: string,
  holidays: string,
  teamId?: number
}

@Component({
  selector: 'new-sprint',
  template: require('./NewSprint.jade')(),
  styles: [require('./NewSprint.scss')],
  directives: [FormSave, Modal, NgForm, ErrorDisplay],
  providers: [NewSprintModel]
})
export class NewSprint {
  @Output() public onSave: EventEmitter<any> = new EventEmitter()
  @Output() public onCancel: EventEmitter<any> = new EventEmitter()

  public modal: ModalConfig
  public newSprintForm: ControlGroup 

  constructor(public newSprint: NewSprintModel, fb: FormBuilder) {
    this.modal = new ModalConfig()
    this.newSprintForm = fb.group({
      boardId: ['', Validators.required],
      holidays: [''],
      team: ['', Validators.required]
    })
  }

  public save() {
    this.newSprint.createSprint(this.newSprintForm.value)
  }

  public cancel() {
    this.onCancel.emit('event')
  }
}
