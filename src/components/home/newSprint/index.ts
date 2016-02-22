import {Component, Output, EventEmitter} from 'angular2/core'
import {Modal, ModalConfig} from 'directives/modal'
import {FormSave} from 'directives/formSave'

@Component({
  selector: 'new-sprint',
  template: require('./newSprint.jade')(),
  styles: [require('./newSprint.scss')],
  directives: [FormSave, Modal]
})
export class NewSprintComponent {
  @Output() public onSave: EventEmitter<any> = new EventEmitter()
  @Output() public onCancel: EventEmitter<any> = new EventEmitter()
  public modal: ModalConfig

  constructor() {
    this.modal = new ModalConfig()
  }

  public save() {
    this.onSave.emit('event')
  }

  public cancel() {
    this.onCancel.emit('event')
  }
}
