import {Reducer, Action} from '@ngrx/store'
import {cloneState} from 'shared/helpers/cloneState'
import {CHECKING_AUTH, CHECKED_AUTH, AUTHORIZED, UNAUTHORIZED, GETTING_AUTH, GOT_AUTH} from '../actions/auth'

export interface IAuthStore {
  isAuthorized?: boolean
  isGettingAuth: boolean
  isCheckingAuthorization: boolean
  trelloToken: string
}

const initialState: IAuthStore = {
  isAuthorized: null,
  isGettingAuth: false,
  isCheckingAuthorization: false,
  trelloToken: ''
}

export const auth: Reducer<IAuthStore> = (state = initialState, {type, payload}: Action): IAuthStore => {
  switch (type) {
    case CHECKING_AUTH:
      return cloneState(state, {isCheckingAuthorization: true, trelloToken: ''})

    case CHECKED_AUTH:
      return cloneState(state, {isCheckingAuthorization: false})

    case AUTHORIZED:
      return cloneState(state, {isAuthorized: true, trelloToken: payload})

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
