import {Injectable} from 'angular2/core'
import {Observable} from 'rxjs/Observable'
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject'
import {Store, Action} from '@ngrx/store'
import {ApiService} from 'angular2-api'
import {SprintApi} from 'api/Sprint'
import {TeamApi} from 'api/Team'
import {INewSprint} from './NewSprint.reducer'

export const FETCH_TEAMS = 'NEW_SPRINT:FETCH_USERS'
export const FETCHING_TEAMS = 'NEW_SPRINT:FETCHING_TEAMS'
export const FETCHED_TEAMS = 'NEW_SPRINT:FETCHED_TEAMS'
export const CREATE_SPRINT = 'NEW_SPRINT:CREATE_SPRINT'
export const CREATING_SPRINT = 'NEW_SPRINT:CREATING_SPRINT'
export const CREATED_SPRINT = 'NEW_SPRINT:CREATED_SPRINT'
export const ERRORS = 'NEW_SPRINT:ERRORS'

@Injectable()
export class NewSprintModel {
  public errors: Observable<string>
  public teams: Observable<any[]>
  private _actions: BehaviorSubject<Action> = new BehaviorSubject<Action>({type: null, payload: null})

  constructor(_store: Store<any>, _sprintApi: SprintApi, _teamApi: TeamApi, _api: ApiService) {
    var store = _store.select<INewSprint>('newSprint')

    this.errors = store
      .map(sprint => sprint.errors)

    this.teams = store
      .map(sprint => sprint.teams)

    let fetchUsers = this._actions
      .filter(({type}: Action) => type === FETCH_TEAMS)
      .do(() => _store.dispatch({type: FETCHING_TEAMS}))
      .mergeMap(() => _api.findAll(_teamApi))
      .map(teamMembers => ({type: FETCHED_TEAMS, payload: teamMembers}))

    let createSprint = this._actions
      .filter(({type}: Action) => type === CREATE_SPRINT)
      .do(() => _store.dispatch({type: CREATING_SPRINT}))
      .mergeMap(({payload}: Action) => _sprintApi.create(payload))
      .map(sprint => ({type: CREATED_SPRINT, payload: sprint}))

    Observable.merge(fetchUsers, createSprint)
      .catch(error => Observable.of({type: ERRORS, payload: error}))
      .subscribe((action: Action) => _store.dispatch(action))
  }

  public fetchTeams() {
    this._actions.next({type: FETCH_TEAMS})
  }

  public createSprint(sprint) {
    this._actions.next({type: CREATE_SPRINT, payload: sprint})
  }
}
