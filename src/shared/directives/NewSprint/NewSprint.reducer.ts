import {Reducer, Action} from '@ngrx/store'
import {FETCHED_TEAMS, ERROR} from './NewSprintModel'

export interface INewSprint {
  teams: any[],
  errors: string
}
export const newSprintInitialState: INewSprint = {
  teams: [],
  errors: ''
}

export const newSprint: Reducer<any> = (state = newSprintInitialState, {type, payload}: Action) => {
  const actionMap = {
    [FETCHED_TEAMS]() {
      return Object.assign({}, state, {
        teams: payload
      })
    },

    [ERROR]() {
      return Object.assign({}, state, {
        errors: payload
      })
    }
  }

  return actionMap[type] ? actionMap[type]() : state
}

