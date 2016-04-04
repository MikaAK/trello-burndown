import {Moment} from 'moment'
import * as moment from 'moment'
import {some} from 'lodash'
import {getTeamVelocity} from 'shared/services/Teams'
import {addWorkingDays} from 'shared/helpers/dates'

export const getCards = function(lists: any[], onlyPointed = true): any[] {
  return _(lists)
    .map('cards')
    .flatten()
    .compact()
    .filter((card: any) => onlyPointed ? card.points : true)
    .value()
}

export const calculateCardPoints = function(cards: any[]): number {
  return _(cards)
    .map('points')
    .sum()
}

export const calculateListPoints = function(lists: any[]): number {
  return calculateCardPoints(getCards(lists))
}

export const splitCards = (sprint: any): any => {
  if (!sprint.board || !sprint.board.lists)
    return sprint

  var completedLists: any[] = sprint.board.lists
    .filter(list => /done!/i.test(list.name))

  var devCompletedLists: any[] = sprint.board.lists
    .filter(list => /signoff|completed|stage/i.test(list.name))

  var bugLists: any[] = sprint.board.lists
    .filter(list => /bugs?/i.test(list.name) && !/extra/.test(list.name))

  var uncompletedLists: any[] = _.without(sprint.board.lists, ...completedLists, ...devCompletedLists, ...bugLists)
    .filter(list => !/defered/i.test(list.name))

  sprint.completedCards = getCards(completedLists)
  sprint.completedPoints = calculateCardPoints(sprint.completedCards)

  sprint.uncompletedCards = getCards(uncompletedLists)
  sprint.uncompletedPoints = calculateCardPoints(sprint.uncompletedCards)

  sprint.devCompletedCards = getCards(devCompletedLists)
  sprint.devCompletedPoints = calculateCardPoints(sprint.devCompletedCards)

  sprint.bugCards = getCards(bugLists, false)

  return sprint
}

export const isSprintStartDate = (sprint): boolean => {
  return sprint.startDate ? moment().isSame(sprint.startDate, 'day') : false
}

export const isSprintList = (name: string): boolean => /\[(school|agency|agent|extra)(\/(school|agency|agent|extra))?.*\]/i.test(name)

export const getSprintLists = (lists: any[]): any[] => {
  return lists
    .filter(list => isSprintList(list.name))
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

export const newSprintToCSV = _.flow(getSprintLists, turnListsToCSV)
