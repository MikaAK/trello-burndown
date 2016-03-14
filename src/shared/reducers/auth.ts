import {Reducer, Action} from '@ngrx/store'
import {cloneState} from 'shared/helpers/cloneState'
import {CHECKING_AUTH, CHECKED_AUTH, AUTHORIZED, UNAUTHORIZED, GETTING_AUTH, GOT_AUTH} from '../actions/auth'

export interface IAuthStore {
  isAuthorized?: boolean
  isGettingAuth: boolean
  isCheckingAuthorization: boolean
}

const initialState: IAuthStore = {
  isAuthorized: null,
  isGettingAuth: false,
  isCheckingAuthorization: false
}

export const auth: Reducer<IAuthStore> = (state = initialState, {type}: Action): IAuthStore => {
  switch (type) {
    case CHECKING_AUTH:
      return cloneState(state, {isCheckingAuthorization: true})

    case CHECKED_AUTH:
      return cloneState(state, {isCheckingAuthorization: false})

    case AUTHORIZED:
      return cloneState(state, {isAuthorized: true})

    case UNAUTHORIZED:
      return cloneState(state, {isAuthorized: false})

    case GETTING_AUTH:
      return cloneState(state, {isGettingAuth: true})

    case GOT_AUTH:
      return cloneState(state, {isGettingAuth: false})

    default:
      return state
  }
}
