import {Component} from 'angular2/core'
import {AuthService} from 'shared/services/Auth'

@Component({
  selector: 'login',
  template: require('./Login.jade')(),
  styles: [require('./Login.scss')],
})
export class LoginComponent {
  constructor(public auth: AuthService) {}
}
