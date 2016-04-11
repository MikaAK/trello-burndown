import {Moment} from 'moment'
import * as moment from 'moment'
import {some} from 'lodash'
import {getTeamVelocity} from 'shared/services/Teams'
import {addWorkingDays, isToday} from 'shared/helpers/dates'

export const getCards = function(lists: any[], onlyPointed = true): any[] {
  return _(lists)
    .map('cards')
    .flatten()
    .compact()
    .filter((card: any) => onlyPointed ? card.points : true)
    .value()
}

export const calculateCardPoints = (cards: any[]): number => {
  return _(cards)
    .map('points')
    .sum()
}

export const calculateListPoints = (lists: any[]): number => calculateCardPoints(getCards(lists))
export const isSprintStartDate = (sprint): boolean => sprint.startDate ? isToday(sprint.startDate) : false
export const calculateSprintListPoints = (lists: any) => {
  var nLists = _(lists)
    .pick(['inProgress', 'complete', 'devComplete', 'unstarted'])
    .values()
    .flatten()
    .value()

  return calculateCardPoints(getCards(nLists))
}

export const turnListsToCSV = (lists: any[]): string => {
  return _(lists)
    .filter((list: any) => some(list.cards))
    .map((list: any) =>  {
      list.cards = list.cards.map((card: any) => {
        card.listName = list.name

        return card
      })

      return list.cards
    })
    .flatten()
    .map((card: any) => {
      const points = card.points || ''

      return `${points}, ${card.listName}, ${card.name.replace(/,/g, '')}, ${card.url}, ${card.id}`
    })
    .unshift('Points, List Name, Title, Url, Card Id')
    .join('\n')
}

export const calculateEndDate = (sprint: any, totalPoints: number): Moment => {
  const velocity = getTeamVelocity(sprint.team),
        days = Math.ceil(totalPoints / velocity) - 1

  return addWorkingDays(moment(sprint.startDate), days)
}

export const changeSprintPoints = (sprint: any, points: number): any {
  let params: any = {points}

  if (sprint.startDate && _.get(sprint, 'team.teamMembers'))
    params.endDate = calculateEndDate(sprint, points)

  return Object.assign({}, sprint, params)
}

