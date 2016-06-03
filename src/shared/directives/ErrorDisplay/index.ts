import {some, words} from 'lodash'
import {Component, Input} from 'angular2/core'

interface ISprint {
  team: any,
  boardId: string,
  holidays: string,
  teamId?: number
}

@Component({
  selector: 'error-display',
  template: require('./ErrorDisplay.jade')()
})
export class ErrorDisplay {
  @Input() public errors: any[]
  public displayErrors: any[]

  public ngDoCheck() {
    if (some(this.errors))
      this.displayErrors = this._convertErrorsForDisplay(this.errors)
  }

  private _convertErrorsForDisplay(errors) {
    if (Array.isArray(errors))
      return errors

    else if (typeof errors === 'object')
      return _(Object.entries('errors' in errors ? errors.errors : errors))
        .map(([key, oErrors]) => oErrors.map(error => `${words(key).map(_.capitalize).join(' ')} - ${error}`))
        .flatten()
        .value()

    else if (typeof errors === 'string')
      return [errors]

    else
      return errors
  }
}
