import {indexOf} from 'lodash'
import {Reducer, Action} from '@ngrx/store'
import {cloneState} from 'shared/helpers/cloneState'
import {
  CREATE_SPRINT_ERROR,
  CREATING_SPRINT,
  CREATED_SPRINT,
  FETCHING_SPRINTS,
  FETCHED_SPRINTS,
  ADD_SPRINTS
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

const addSprints = function(state, sprint: any|any[]) {
  debugger
  if (Array.isArray(sprint))
    return sprint.map((iSprint) => addSprints(state, iSprint))
  else
    return state.sprints
      .filter(iSprint => iSprint.id !== sprint.id)
      .concat(sprint)
}

export const sprint: Reducer<ISprintStore> = (state = initialState, {type, payload}: Action): ISprintStore => {
  switch (type) {
    case CREATE_SPRINT_ERROR:
      return cloneState(state, {
        isCreating: false,
        createErrors: payload
      })

    case CREATING_SPRINT:
      return cloneState(state, {
        createErrors: [],
        isCreating: true
       })

    case CREATED_SPRINT:
      return cloneState(state, {
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

    case ADD_SPRINTS:
      return cloneState(state, {
        sprints: addSprints(state, payload)
      })

    default:
      return state
  }
}


