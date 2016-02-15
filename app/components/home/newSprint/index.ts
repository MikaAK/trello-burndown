import {Component} from 'angular2/core'
import {FormSave} from 'directives/formSave'

@Component({
  selector: 'new-sprint',
  template: require('./newSprint.jade')(),
  styles: [require('./newSprint.scss')],
  directives: [FormSave]
})
export class NewSprintComponent {

}
