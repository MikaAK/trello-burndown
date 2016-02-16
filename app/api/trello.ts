declare var __TRELLO_KEY__: string

import {Observable} from 'rxjs'
import {Injectable} from 'angular2/core'
import {Http, Response} from 'angular2/http'

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

@Injectable()
export class TrelloApi {
  constructor(private http: Http) {} 

  public getAuthorization() {
    var authWindow = window.open(TRELLO_AUTH_SECRET_URL)

    return Observable.create(function(observer) {
      // TODO: check for auth key in localstorage

      var onComplete = function(event) {
        if (event.source !== authWindow)
          return

        // TODO: Set key into localstorage
        
        observer.next(event.data)
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
