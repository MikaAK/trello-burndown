import {Component, Output, EventEmitter} from 'angular2/core'
import {FormSave} from 'directives/formSave'

@Component({
  selector: 'new-sprint',
  template: require('./newSprint.jade')(),
  styles: [require('./newSprint.scss')],
  directives: [FormSave]
})
export class NewSprintComponent {
  @Output() public onSave: EventEmitter<any> = new EventEmitter()
  @Output() public onCancel: EventEmitter<any> = new EventEmitter()

  public save() {
    this.onSave.emit('event')
  }

  public cancel() {
    this.onCancel.emit('event')
  }
}
