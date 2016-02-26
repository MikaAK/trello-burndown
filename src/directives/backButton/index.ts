import {Component} from 'angular2/core'
import {Router} from 'angular2/router'

@Component({
  selector: 'back-button',
  template: require('./backButton.jade')(),
  styles: [require('./backButton.scss')]
})
export class BackButton {
  constructor(private router: Router) {}

  public goBack() {
    var currentLocation: string = location.href

    history.back()

    // Check after back has had chance if is on same page
    setTimeout(() => {
      if (currentLocation === location.href)
        this.router.navigate(['Home'])
    }, 100)
  }
}
