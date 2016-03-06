declare const  __DEV__: boolean

import {provideStore, Middleware, usePreMiddleware, usePostMiddleware} from '@ngrx/store'
import {reducers} from 'shared/reducers'

const actionLog: Middleware = action => {
  return action.do(val => {
    if (__DEV__)
      console.warn('DISPATCHED ACTION: ', val)
  })
}

const stateLog: Middleware = state => {
  return state.do(val => {
    if (__DEV__)
      console.info('NEW STATE: ', val)
  })
}

export const STORE_PROVIDERS = [
  provideStore(reducers),
  usePreMiddleware(actionLog),
  usePostMiddleware(stateLog)
]
