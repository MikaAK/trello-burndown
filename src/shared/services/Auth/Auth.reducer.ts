import {Reducer, Action} from '@ngrx/store'
import {CHECKING_AUTH, CHECKED_AUTH, AUTHORIZED, UNAUTHORIZED, GETTING_AUTH, GOT_AUTH} from '.'

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

const createState = (state, changes) => {
  return Object.assign({}, state, changes)
}

export const auth: Reducer<IAuth> = (state = initialAuthState, {type, payload}: Action): IAuth => {
  const actionMap = {
    [CHECKING_AUTH]() {
      return createState(state, {isCheckingAuthorization: true})
    },

    [CHECKED_AUTH]() {
      return createState(state, {isCheckingAuthorization: false})
    },

    [AUTHORIZED]() {
      return createState(state, {
        isCheckingAuthorization: false,
        isGettingAuth: false,
        isAuthorized: true
      })
    },

    [UNAUTHORIZED]() {
      return createState(state, {
        isCheckingAuthorization: false,
        isGettingAuth: false,
        isAuthorized: false
      })
    },

    [GETTING_AUTH]() {
      return createState(state, {isGettingAuth: true})
    },

    [GOT_AUTH]() {
      return createState(state, {isGettingAuth: false})
    }
  }

  if (actionMap[type])
    return actionMap[type]()

  return state
}
