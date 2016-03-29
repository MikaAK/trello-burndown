import {convertData} from './dataConversion'
import * as moment from 'moment'

export const convertDates: any = convertData((data: any) => {
  return Object.entries(data)
    .map(([key, value]) => {
      if (typeof value === 'object')
        return [key, convertDates(value)]
      else if (typeof value === 'string' && /[0-9]{4}-[0-3][0-9]-[0-9]{2}/.test(value))
        return [key, moment.apply(moment, value.split('-'))]
      else
        return [key, value]
    })
    .reduce((res, [key, value]) => {
      res[key] = value

      return res
    }, {})
})
