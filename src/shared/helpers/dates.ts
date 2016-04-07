import * as moment from 'moment'
import {Moment} from 'moment'
import {Config} from 'config'

const SATURDAY = 6,
      SUNDAY = 7,
      HOLIDAYS = require('holidays')
        .holidays
        .map((holiday: string) => moment(holiday, Config.holidaysFormat))

export const isToday = (date: Moment|Date) => moment(moment).isSame(moment(date), 'day')
export const isHoliday = (date: Moment|Date): boolean => HOLIDAYS.some((holiday: Moment) => holiday.isSame(moment(date), 'day'))
export const isWeekend = (date: Moment|Date): boolean => {
  const weekday = moment(date).isoWeekday()

  return weekday === SATURDAY || weekday === SUNDAY
}

export const addWorkingDays = (date: Moment|Date, days: number): Moment => {
  let futureDate = moment(date)

  while (days > 0) {
    futureDate = futureDate.add(1, 'days')

    if (!isWeekend(futureDate) && !isHoliday(futureDate))
      days -= 1
  }

  return futureDate
}

