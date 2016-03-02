import {Injectable} from 'angular2/core'
import {Observable} from 'rxjs/Observable'
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject'
import {Store, Action} from '@ngrx/store'
import {TrelloApi} from 'api/Trello'
import {IAuth} from './Auth.reducer'

export const CHECK_AUTH = 'AUTH:CHECK_AUTH'
export const CHECKING_AUTH = 'AUTH:CHECKING_AUTH'
export const CHECKED_AUTH = 'AUTH:CHECKED_AUTH'
export const AUTHORIZED = 'AUTH:AUTHORIZED'
export const UNAUTHORIZED = 'AUTH:UNAUTHORIZED'
export const GET_AUTH = 'AUTH:GET_AUTH'
export const GETTING_AUTH = 'AUTH:GETTING_AUTH'
export const GOT_AUTH = 'AUTH:GOT_AUTH'

@Injectable()
export class Auth {
  public isAuthorized: Observable<boolean>
  public isCheckingAuthorization: Observable<boolean>
  public isGettingAuth: Observable<boolean>
  private _actions: BehaviorSubject<Action> = new BehaviorSubject<Action>({type: null, payload: null})

  constructor(private _store: Store<any>, private _trelloApi: TrelloApi) {
    const store = _store.select<IAuth>('auth')

    this.isAuthorized = store
      .map(auth => auth.isAuthorized)
      .distinctUntilChanged()

    this.isGettingAuth = store
      .map(auth => auth.isGettingAuth)

    this.isCheckingAuthorization = store
      .map(auth => auth.isCheckingAuthorization)
      .distinctUntilChanged()

    let checkAuth = this._actions
      .filter(({type}: Action) => type === CHECK_AUTH)
      .map(() => this._isAuthorized())

    let getAuth = this._actions
      .filter(({type}: Action) => type === GET_AUTH)
      .do(() => _store.dispatch({type: GETTING_AUTH}))
      .mergeMap(() => this._getTrelloAuth())
      .do(() => _store.dispatch({type: GOT_AUTH}))
      .do()
      .map(key => key && !/invalid/.test(<string>key))

    Observable.merge(checkAuth, getAuth)
      .map(isAuthorized => ({type: isAuthorized ? AUTHORIZED : UNAUTHORIZED}))
      .subscribe({
        next: action => _store.dispatch(action),
        error: () => _store.dispatch({type: UNAUTHORIZED})
      })
  }

  public checkAuth() {
    this._actions.next({type: CHECK_AUTH})
  }

  public getAuth() {
    console.log('next')
    this._actions.next({type: GET_AUTH})
  }

  private _getTrelloAuth() {
    return this._trelloApi.getAuthorization()
      .catch(() => Observable.of(false))
  }

  private _isAuthorized() {
    this._store.dispatch({type: CHECKING_AUTH})
    this._store.dispatch({type: CHECKED_AUTH})

    return this._trelloApi.isAuthorized()
  }
}
