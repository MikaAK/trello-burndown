import {Injectable} from 'angular2/core'
import {Observable} from 'rxjs/Observable'
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject'
import {Store, Action} from '@ngrx/store'
import {ApiService} from 'angular2-api'

import {SprintApi} from 'api/Sprint'
import {TrelloApi} from 'api/Trello'
import {ISprintStore} from 'shared/reducers/sprint'
import {ADD_API_ERROR} from 'shared/actions/error'
import {changeSprintPoints, calculateListPoints, splitCards} from 'shared/helpers/sprint'
import {
  FETCH_SPRINTS,
  FETCH_SPRINT,
  FETCHING_SPRINTS,
  FETCHED_SPRINTS,
  UPDATE_SPRINT,
  UPDATING_SPRINT,
  UPDATED_SPRINT,
  CREATE_SPRINT,
  CREATING_SPRINT,
  CREATED_SPRINT,
  CREATE_SPRINT_ERROR,
  UPDATE_SPRINT_ERROR,
  CALCULATE_POINTS,
  CALCULATING_POINTS,
  CALCULATED_POINTS,
  ADD_SPRINTS
} from 'shared/actions/sprint'

@Injectable()
export class Sprints {
  public errors: Observable<any[]>
  public items: Observable<any[]>
  public isFetching: Observable<boolean>
  public isCreating: Observable<boolean>

  private _actions: BehaviorSubject<Action> = new BehaviorSubject<Action>({type: null, payload: null})

  constructor(private _api: ApiService, private _trelloApi: TrelloApi, private _sprintApi: SprintApi, private _store: Store<any>) {
    let store = _store.select<ISprintStore>('sprint')

    this.items = store.map(({sprints}: ISprintStore) => sprints)
    this.errors = store.map(({createErrors}: ISprintStore) => createErrors)
    this.isFetching = store.map(({isFetching}: ISprintStore) => isFetching)
    this.isCreating = store.map(({isCreating}: ISprintStore) => isCreating)

    let createSprint = this._actions
      .filter(({type}: Action) => type === CREATE_SPRINT)
      .do(() => _store.dispatch({type: CREATING_SPRINT}))
      .mergeMap(({payload}: Action) => this._createSprint(payload))

    let fetchSprints = this._actions
      .filter(({type}: Action) => type === FETCH_SPRINTS)
      .do(() => _store.dispatch({type: FETCHING_SPRINTS}))
      .mergeMap(({payload}: Action) => this._fetchSprints(payload))

    let fetchSprint = this._actions
      .filter(({type}: Action) => type === FETCH_SPRINT)
      .do(() => _store.dispatch({type: FETCHING_SPRINTS}))
      .mergeMap(({payload}: Action) => this._fetchSprint.apply(this, payload))

    let calculatePoints = this._actions
      .filter(({type}: Action) => type === CALCULATE_POINTS)
      .do(({payload}: Action) => _store.dispatch({type: CALCULATING_POINTS, payload}))
      .mergeMap(({payload}: Action) => this._calculatePoints(payload))

    let updateSprint = this._actions
      .filter(({type}: Action) => type === UPDATE_SPRINT)
      .do(({payload}: Action) => _store.dispatch({type: UPDATING_SPRINT, payload}))
      .mergeMap(({payload}: Action) => this._updateSprint(payload))

    Observable.merge(
      createSprint,
      fetchSprints,
      fetchSprint,
      calculatePoints,
      updateSprint
    )
      .subscribe((action: Action) => _store.dispatch(action))
  }

  public create(sprint): void {
    this._actions.next({type: CREATE_SPRINT, payload: sprint})
  }

  public findAll(): void {
    this._actions.next({type: FETCH_SPRINTS})
  }

  public find(id: string|number, params?: any): void {
    this._actions.next({type: FETCH_SPRINT, payload: [id, params]})
  }

  public calculatePoints(sprint): void {
    this._actions.next({type: CALCULATE_POINTS, payload: sprint})
  }

  private _calculatePoints(sprint): Observable<Action> {
    return this._calculatePointsNoUpdate(sprint)
      .mergeMap(points => this._compairAndUpdatePoints(sprint, points))
      .map(iSprint => ({type: CALCULATED_POINTS, payload: iSprint}))
  }

  private _compairAndUpdatePoints(sprint: any, points: number): Observable<any> {
    if (sprint.id && +points !== +sprint.points)
      return this._api.update(this._sprintApi, changeSprintPoints(sprint, points))
        .map(nSprint => Object.assign(sprint, nSprint))
    else
      return Observable.of(sprint)
  }

  private _calculatePointsNoUpdate(sprint): Observable<number> {
    return this._trelloApi.getBoardLabels(sprint.boardId)
      .map(labels => labels.reduce((res, label) => res += label.points, 0))
  }

  private _updateSprint(sprint): Observable<Action> {
    return this._api.update(this._sprintApi, sprint)
      .do(({payload}: Action) => this._store.dispatch({type: UPDATED_SPRINT, payload}))
      .map(nSprint => ({type: ADD_SPRINTS, payload: nSprint}))
      .catch(error => Observable.of({type: UPDATE_SPRINT_ERROR, payload: error}))
  }

  private _fetchSprint(id, params): Observable<Action> {
    return this._findSprint(id params)
      .do(() => this._store.dispatch({type: FETCHED_SPRINTS}))
      .mergeMap((sprint: any) => this._compairAndUpdatePoints(sprint, calculateListPoints(sprint.board.lists)))
      .map(sprint => ({type: ADD_SPRINTS, payload: sprint}))
      .catch(error => Observable.of({type: ADD_API_ERROR, payload: error}))
  }

  private _findSprint(id, params?): Observable<any> {
    return this._api.find(this._sprintApi, id, params)
      .mergeMap(sprint => this._attachBoardToSprint(sprint))
  }

  private _fetchSprints(params?: any): Observable<Action> {
    return this._api.findAll(this._sprintApi, params)
      .do(sprint => this._store.dispatch({type: FETCHED_SPRINTS}))
      .map(sprint => ({type: ADD_SPRINTS, payload: sprint}))
      .catch(error => Observable.of({type: ADD_API_ERROR, payload: error}))
  }

  private _createSprint(data): Observable<Action> {
    return this._calculatePointsNoUpdate(data)
      .mergeMap(points => this._sprintApi.create(changeSprintPoints(data, points)))
      .map(sprint => ({type: CREATED_SPRINT, payload: sprint}))
      .catch(error => Observable.of({type: CREATE_SPRINT_ERROR, payload: error}))
  }

  private _attachBoardToSprint(sprint): Observable<any> {
    return this._trelloApi.getFullBoard(sprint.boardId)
      .map(board => {
        sprint.board = board
        sprint.teamName = sprint.team ? sprint.team.name : ''

        return sprint
      })
      .map(splitCards)
  }
}
