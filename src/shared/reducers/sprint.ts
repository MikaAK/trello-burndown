import {Reducer, Action} from '@ngrx/store'
import {cloneState} from 'shared/helpers/cloneState'
import {
  CREATE_SPRINT_ERROR,
  CREATING_SPRINT,
  CREATED_SPRINT,
  FETCHING_SPRINTS,
  FETCHED_SPRINTS,
  ADD_SPRINTS,
  CALCULATING_POINTS,
  CALCULATED_POINTS
} from '../actions/sprint'

export interface ISprintData {
  sprint: any
  isCalculating: boolean
}

export interface ISprintStore {
  sprints: ISprintData[]
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

// const getSprintIndex = (sprints: ISprintData[], item: ISprintData): number => {
  // var index = -1

  // sprints.some((sItem: ISprintData, i: number) => {
    // if (sItem.sprint.id === item.sprint.id) {
      // index = i

      // return true
    // }
  // })

  // return index
// }

const hasSprint = (state: ISprintStore, item: ISprintData) => {
  return state.sprints
    .some(({sprint}: ISprintData) => sprint.id === item.sprint.id)
}

const addSprintToState = function(state: ISprintStore, item: ISprintData): ISprintData[] {
  if (hasSprint(state, item))
    return state.sprints
      .map(iSprint => iSprint.sprint.id === item.sprint.id ? item : iSprint)
  else
    return state.sprints.concat(item)
}


const addSprints = (state: ISprintStore, item: ISprintData|ISprintData[]): ISprintData[]  => {
  if (Array.isArray(item))
    return item
  else
    return addSprintToState(state, item)
}

const convertSprintToState = (sprint) => {
  if (Array.isArray(sprint))
    return sprint.map(iSprint => convertSprintToState(iSprint))
  else
    return {sprint}
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
        isFetching: false
      })

    case ADD_SPRINTS:
      return cloneState(state, {
        sprints: addSprints(state, convertSprintToState(payload))
      })

    case CALCULATING_POINTS:
      return cloneState(state, {
        sprints: addSprints(state, Object.assign({sprint: payload}, {
          isCalculating: true
        }))
      })

    case CALCULATED_POINTS:
      return cloneState(state, {
        sprints: addSprints(state, Object.assign({sprint: payload}, {
          isCalculating: false
        }))
      })

    default:
      return state
  }
}


