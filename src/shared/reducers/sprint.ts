import {Reducer, Action} from '@ngrx/store'
import {cloneState} from 'shared/helpers/cloneState'
import {
  CREATE_SPRINT_ERROR,
  CREATING_SPRINT,
  CREATED_SPRINT,
  FETCHING_SPRINTS,
  FETCHED_SPRINTS
} from '../actions/sprint'

export interface ISprintStore {
  sprints: any[]
  createErrors: any[]
  isFetching: boolean
  isCreating: boolean
}

const initialState: ISprintStore = {
  sprints: [],
  createErrors: [],
  isFetching: false,
  isCreating: false
}

export const sprint: Reducer<ISprintStore> = (state = initialState, {type, payload}: Action): ISprintStore => {
  switch (type) {
    case CREATE_SPRINT_ERROR:
      return cloneState(state, {createErrors: payload})

    case CREATING_SPRINT:
      return cloneState(state, {
        createErrors: [],
        isCreating: true
       })

    case CREATED_SPRINT:
      return cloneState(state, {
        sprints: state.sprints.concat(payload),
        isCreating: false
      })

    case FETCHING_SPRINTS:
      return cloneState(state, {
        fetchErrors: [],
        isFetching: true
      })

    case FETCHED_SPRINTS:
      return cloneState(state, {
        sprints: payload,
        isFetching: false
      })

    default:
      return state
  }
}


