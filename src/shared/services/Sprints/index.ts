import {Injectable} from 'angular2/core'
import {Observable} from 'rxjs/Observable'
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject'
import {Store, Action} from '@ngrx/store'
import {ApiService} from 'angular2-api'
import {SprintApi} from 'api/Sprint'
import {ISprintStore} from 'shared/reducers/sprint'
import {ADD_API_ERROR} from 'shared/actions/error'
import {
  FETCH_SPRINTS,
  FETCHING_SPRINTS,
  FETCHED_SPRINTS,
  CREATE_SPRINT,
  CREATING_SPRINT,
  CREATED_SPRINT,
  CREATE_SPRINT_ERROR
} from 'shared/actions/sprint'

@Injectable()
export class Sprints {
  public errors: Observable<any[]>
  public items: Observable<any[]>
  private _actions: BehaviorSubject<Action> = new BehaviorSubject<Action>({type: null, payload: null})

  constructor(private _api: ApiService, private _sprintApi: SprintApi, _store: Store<any>) {
    var store = _store.select<ISprintStore>('sprint')

    this.items = store.map(({sprints}: ISprintStore) => sprints)
    this.errors = store.map(({createErrors}: ISprintStore) => createErrors)

    let createSprint = this._actions
      .filter(({type}: Action) => type === CREATE_SPRINT)
      .do(() => _store.dispatch({type: CREATING_SPRINT}))
      .mergeMap(({payload}: Action) => this._createSprint(payload))

    let fetchSprints = this._actions
      .filter(({type}: Action) => type === FETCH_SPRINTS)
      .do(() => _store.dispatch({type: FETCHING_SPRINTS}))
      .mergeMap(({payload}: Action) => this._fetchSprints(payload))

    Observable.merge(createSprint, fetchSprints)
      .subscribe((action: Action) => _store.dispatch(action))
  }

  public create(sprint): void {
    this._actions.next({type: CREATE_SPRINT, payload: sprint})
  }

  public findAll() {
    this._actions.next({type: FETCH_SPRINTS})
  }

  private _fetchSprints(params?: any): Observable<Action> {
    return this._api.findAll(this._sprintApi, params)
      .map(sprints => ({type: FETCHED_SPRINTS, payload: sprints}))
      .catch(error => Observable.of({type: ADD_API_ERROR, payload: error}))
  }

  private _createSprint(data): Observable<Action> {
    return this._sprintApi.create(data)
      .map(sprint => ({type: CREATED_SPRINT, payload: sprint}))
      .catch(error => Observable.of({type: CREATE_SPRINT_ERROR, payload: error}))
  }
}
