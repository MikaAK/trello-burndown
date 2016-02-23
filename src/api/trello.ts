declare var __TRELLO_KEY__: string

import {groupBy, find} from 'lodash'
import {Observable} from 'rxjs/Observable'
import {Injectable} from 'angular2/core'
import {Http} from 'angular2/http'
import {Locker} from 'angular2-locker'

import {objToQueryParams} from './lib/helpers'

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

  public isAuthorized(): boolean {
    return <boolean>this.locker.get(TRELLO_KEY)
  }

  public getAuthorization(): Observable<any> {
    var authWindow = window.open(TRELLO_AUTH_SECRET_URL)

    return new Observable(observer => {
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

  public getCards(boardId: string|number): Observable<any> {
    return this.http.get(this.createTrelloUrl(`boards/${boardId}/cards`))
      .map(data => data.json())
  }

  public getBoard(boardId: string|number): Observable<any> {
    return this.http.get(this.createTrelloUrl(`boards/${boardId}`))
      .map(data => data.json())
  }

  public getLists(boardId: string|number): Observable<any> {
    return this.http.get(this.createTrelloUrl(`boards/${boardId}/lists`))
      .map(data => data.json())
  }

  public getLabels(boardId: string|number): Observable<any> {
    return this.http.get(this.createTrelloUrl(`boards/${boardId}/labels`))
      .map(data => data.json())
  }

  public getFullBoard(boardId: string|number): Observable<any> {
    var attachLists = (board) => {
      return this.getLists(boardId)
      .map(function(lists) {
        board.lists = lists

        return board
      })
    }

    var attachLabels = (cards: any[]) => {
      return this.getLabels(boardId)
        .map((labels: any[]) => cards.map(card => {
          card.labels = card.idLabels.map(id => find(labels, {id}))

          return card
        }))
    }

    var attachCards = (board) => {
      return this.getCards(boardId)
        .mergeMap(attachLabels)
        .map(function(cards: any[]) {
          var listIds = groupBy(cards, 'idList')
          var listItems: any[] = Object.entries(listIds)

          for (let [id, lCards] of listItems) {
            let list: any = find(board.lists, {id})

            list.cards = lCards
          }

          return board
        })
    }

    return this.getBoard(boardId)
      .mergeMap(attachLists)
      .mergeMap(attachCards)
  }

  private createTrelloUrl(url: string): string {
    var secret = this.locker.get(TRELLO_KEY),
        params = `token=${secret}&key=${__TRELLO_KEY__}`,
        base = /\?/.test(url) ? url + params : `${url}?${params}`

    return TRELLO_BASE + base
  }
}
