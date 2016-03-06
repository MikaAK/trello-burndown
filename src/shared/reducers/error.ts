import {Reducer, Action} from '@ngrx/store'
import {cloneState} from 'shared/helpers/cloneState'
import {ADD_API_ERROR} from '../actions/error'

export interface IErrorStore {
  apiErrors: any[]
}

const initialState: IErrorStore = {
  apiErrors: []
}

export const error: Reducer<IErrorStore> = (state = initialState, {type, payload}: Action): IErrorStore => {
  switch(type) {
    case ADD_API_ERROR:
      return cloneState(state, {
        apiErrors: payload
      })

    default:
      return state
  }
}
