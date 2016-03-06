import {Reducer, Action} from '@ngrx/store'
import {cloneState} from 'shared/helpers/cloneState'

import {
  FETCHING_TEAMS,
  FETCHED_TEAMS,
  CREATING_TEAM,
  CREATED_TEAM,
  CREATE_TEAM_ERROR
} from '../actions/team'

export interface ITeamStore {
  teams: any[]
  createErrors: any[]
  isFetchingTeam: boolean
  isCreatingTeam: boolean
}

const initialState =  {
  teams: [],
  createErrors: [],
  isFetchingTeam: false,
  isCreatingTeam: false
}

export const team: Reducer<ITeamStore> = (state = initialState, {type, payload}: Action): ITeamStore => {
  switch(type) {
    case FETCHING_TEAMS:
      return cloneState(state, {
        isFetchingTeam: true
      })

    case FETCHED_TEAMS:
      return cloneState(state, {
        isFetchingTeam: false,
        teams: payload
      })

    case CREATING_TEAM:
      return cloneState(state, {
        isCreatingTeam: true
      })

    case CREATED_TEAM:
      return cloneState(state, {
        isCreatingTeam: false
      })

    case CREATE_TEAM_ERROR:
      return cloneState(state, {
        isCreatingTeam: false,
        createErrors: payload
      })
    
    default:
      return state
  }
}
