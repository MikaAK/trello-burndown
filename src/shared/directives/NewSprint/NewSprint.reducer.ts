import {Reducer, Action} from '@ngrx/store'
import {FETCHED_TEAMS, ERRORS, CREATING_SPRINT} from './NewSprintModel'
import {cloneState} from 'shared/helpers/cloneState'

export interface INewSprint {
  teams: any[],
  errors: any[]
}
export const newSprintInitialState: INewSprint = {
  teams: [],
  errors: []
}

export const newSprint: Reducer<INewSprint> = (state = newSprintInitialState, {type, payload}: Action): INewSprint => {
  switch(type) {
    case FETCHED_TEAMS:
      return cloneState(state, {teams: payload})

    case ERRORS:
      let errors

      if (typeof payload === 'string')
        errors = [payload]
      else
        errors = payload

      return cloneState(state, {errors})

    case CREATING_SPRINT:
      return cloneState(state, {errors: ''})

    default:
      return state
  }
}

