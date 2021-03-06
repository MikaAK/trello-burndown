import {Component, Output, Input, EventEmitter} from 'angular2/core'

@Component({
  selector: 'form-save',
  template: require('./FormSave.jade')(),
  styles: [require('./FormSave.scss')]
})
export class FormSave {
  @Input() public saveText: string = 'Save'
  @Output() public onCancel: EventEmitter<any> = new EventEmitter()

  public cancel() {
    this.onCancel.emit('event')
  }
}
