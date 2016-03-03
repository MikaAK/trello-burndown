import {Reducer, Action} from '@ngrx/store'
import {CHECKING_AUTH, CHECKED_AUTH, AUTHORIZED, UNAUTHORIZED, GETTING_AUTH, GOT_AUTH} from '.'
import {cloneState} from 'shared/helpers/cloneState'

export interface IAuth {
  isAuthorized: boolean
  isGettingAuth: boolean
  isCheckingAuthorization: boolean
}

export const initialAuthState: IAuth = {
  isAuthorized: false,
  isGettingAuth: false,
  isCheckingAuthorization: false
}

export const auth: Reducer<IAuth> = (state = initialAuthState, {type, payload}: Action): IAuth => {
  switch(type) {
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
