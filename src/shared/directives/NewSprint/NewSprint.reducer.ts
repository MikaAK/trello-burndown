import {Reducer, Action} from '@ngrx/store'
import {FETCHED_TEAMS, ERRORS, CREATING_SPRINT} from './NewSprintModel'
import {cloneState} from 'shared/helpers/cloneState'

export interface INewSprint {
  teams: any[],
  errors: string
}
export const newSprintInitialState: INewSprint = {
  teams: [],
  errors: ''
}

export const newSprint: Reducer<INewSprint> = (state = newSprintInitialState, {type, payload}: Action): INewSprint => {
  switch(type) {
    case FETCHED_TEAMS:
      return cloneState(state, {teams: payload})

    case ERRORS:
      debugger
      return cloneState(state, {
        errors: 'message' in payload ? payload.message : payload
      })

    case CREATING_SPRINT:
      return cloneState(state, {errors: ''})

    default:
      return state
  }
}

