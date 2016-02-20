declare var __TRELLO_KEY__: string

import {Observable} from 'rxjs'
import {Injectable} from 'angular2/core'
import {Http} from 'angular2/http'
import {Locker} from 'angular2-locker'

import {objToQueryParams} from './helpers'

const TRELLO_BASE = 'https://trello.com/1/'

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

const TRELLO_AUTH_SECRET_URL = `${TRELLO_BASE}authorize?${objToQueryParams(TRELLO_BASE_CONFIG)}`
const TRELLO_KEY = 'trelloKey'

export {TRELLO_KEY}

@Injectable()
export class TrelloApi {
  constructor(private http: Http, private locker: Locker) {}

  public isAuthorized() {
    return <boolean>this.locker.get(TRELLO_KEY)
  }

  public getAuthorization() {
    var authWindow = window.open(TRELLO_AUTH_SECRET_URL)

    return Observable.create(observer => {
      if (this.isAuthorized()) {
        console.log('Have Trello Key: ', this.locker.get(TRELLO_KEY))
        observer.next(this.locker.get(TRELLO_KEY))
        observer.complete()

        return
      }

      var onComplete = event => {
        if (event.source !== authWindow)
          return

        if (event.data) {
          this.locker.set(TRELLO_KEY, event.data)
          observer.next(event.data)
        } else
          observer.error(event.data)

        observer.complete()
      }

      var exitWindow = function() {
        authWindow.close()
        window.removeEventListener('message', onComplete)
      }

      window.addEventListener('message', onComplete)

      return exitWindow
    })
  }
}
