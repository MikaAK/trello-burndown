import * as moment from 'moment'
import {Moment} from 'moment'
import {Pipe, PipeTransform} from 'angular2/core'

/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ date |  momentDate: "MMMM-DDD"}}
 *   formats to: January-80
*/
@Pipe({name: 'momentDate'})
export class MomentPipe implements PipeTransform {
  public transform(value: Moment, [format]): string {
    return moment(value).format(format || 'dddd MMMM Do')
  }
}
