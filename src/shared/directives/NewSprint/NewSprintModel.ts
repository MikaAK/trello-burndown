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
  public errors: Observable<any[]>
  public teams: Observable<any[]>
  private _actions: BehaviorSubject<Action> = new BehaviorSubject<Action>({type: null, payload: null})

  constructor(private _api: ApiService, private _sprintApi: SprintApi, private _teamApi: TeamApi, _store: Store<any>) {
    var store = _store.select<INewSprint>('newSprint')

    this.errors = store
      .map(sprint => sprint.errors)

    this.teams = store
      .map(sprint => sprint.teams)

    let fetchUsers = this._actions
      .filter(({type}: Action) => type === FETCH_TEAMS)
      .do(() => _store.dispatch({type: FETCHING_TEAMS}))
      .mergeMap(() => this._findAllTeams())

    let createSprint = this._actions
      .filter(({type}: Action) => type === CREATE_SPRINT)
      .do(() => _store.dispatch({type: CREATING_SPRINT}))
      .do(() => console.log('Creating Sprint'))
      .mergeMap(({payload}: Action) => this._createSprint(payload))
      .do(() => console.log('Created Sprint'))

    Observable.merge(fetchUsers, createSprint)
      .subscribe((action: Action) => _store.dispatch(action))
  }

  public fetchTeams(): void {
    this._actions.next({type: FETCH_TEAMS})
  }

  public createSprint(sprint): void {
    this._actions.next({type: CREATE_SPRINT, payload: sprint})
  }

  private _findAllTeams(): Observable<any> {
    return this._api.findAll(this._teamApi)
      .map(teamMembers => ({type: FETCHED_TEAMS, payload: teamMembers}))
      .catch(error => Observable.of({type: ERRORS, payload: error}))
  }

  private _createSprint(sprint): Observable<Action> {
    let params = {
      teamId: '',
      boardId: sprint.boardId,
      holidays: sprint.holidays
        .split(',')
        .map(str => str.trim())
    }

    return this.teams
      .map(teams => {
        if (sprint.team)
          params.teamId = _.find(teams, {name: sprint.team}).id

        return params
      })
      .mergeMap((sParams) => this._sprintApi.create(sParams))
      .map(sprint => ({type: CREATED_SPRINT, payload: sprint}))
      .catch(error => Observable.of({type: ERRORS, payload: error}))
  }
}
