declare var __TRELLO_KEY__: string

import {Observable} from 'rxjs/Observable'
import {Injectable} from 'angular2/core'
import {Locker} from 'angular2-locker'
import {ApiResource, ApiService} from 'angular2-api'
import {RequestOptionsArgs, Headers} from 'angular2/http'

import {objToQueryParams} from './helpers'
import {openWindow} from 'shared/helpers/openWindow'

const TRELLO_BASE_CONFIG = {
  key: __TRELLO_KEY__,
  name: 'Edvisor',
  persist: true,
  return_url: location.origin,
  interactive: true,
  type: 'popup',
  response_type: 'token',
  expiration: 'never',
  scope: 'read,write',
  callback_method: 'postMessage'
}

const TRELLO_BASE = 'https://trello.com/1/'
const TRELLO_AUTH_SECRET_URL = `${TRELLO_BASE}authorize?${objToQueryParams(TRELLO_BASE_CONFIG)}`
const TRELLO_LOCKER_KEY = 'trelloKey'

export {TRELLO_LOCKER_KEY}

@Injectable()
export class TrelloApi implements ApiResource {
  public endpoint: string = 'trello'

  constructor(private _api: ApiService, private locker: Locker) {}

  public get trelloToken(): string {
    return this.locker.get(TRELLO_LOCKER_KEY)
  }

  public isAuthorized(): boolean {
    return !!this.locker.get(TRELLO_LOCKER_KEY)
  }

  public getAuthorization(): Observable<any> {
    return new Observable(observer => {

      if (this.isAuthorized()) {
        observer.next(this.locker.get(TRELLO_LOCKER_KEY))
        observer.complete()

        return
      }

      return openWindow(TRELLO_AUTH_SECRET_URL, (win, event) => {
        if (!event || !event.data) {
          observer.error()
        } else if (event.data) {
          this.locker.set(TRELLO_LOCKER_KEY, event.data)
          observer.next(event.data)
          observer.complete()
        }
      })
    })
  }

  public getBoardLabels(board_id: string|number, params?: RequestOptionsArgs): Observable<any> {
    return this._api.get(this, `boards/${board_id}/labels`, params)
  }

  public getBoard(board_id: string|number, params?: RequestOptionsArgs): Observable<any> {
    return this._api.get(this, `boards/${board_id}`, params)
  }

  public serializeParams(params: RequestOptionsArgs) {
    if (!params.headers)
      params.headers = new Headers()

    params.headers.set('authorization', this.trelloToken)

    return params
  }
}
