import {convertData} from './dataConversion'
import * as moment from 'moment'

const DATE_FORMAT = 'YYYY-MM-DD'

const formatMoment = (date) {
  if (date._f === DATE_FORMAT)
    return date.format(DATE_FORMAT)
  else
    return date.toJSON()
}

export const convertDates: any = convertData((data: any) => {
  return Object.entries(data)
    .map(([key, value]) => {
      if (value && typeof value === 'object')
        return [key, convertDates(value)]
      else if (typeof value === 'string' && /[0-9]{4}-[0-3][0-9]-[0-9]{2}/.test(value))
        return [key, moment(value, 'YYYY-MM-DD')]
      else
        return [key, value]
    })
    .reduce((res, [key, value]) => {
      res[key] = value

      return res
    }, {})
})

export const convertMomentToString: any = convertData((data: any) => {
  return Object.entries(data)
    .map(([key, value]) => {
      if (moment.isMoment(value))
        return [key, formatMoment(value)]
      else
        return [key, value]
    })
    .reduce((res, [key, value]) => {
      res[key] = value

      return res
    }, {})
})
