import {Injectable} from 'angular2/core'
import {Observable} from 'rxjs/Observable'
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject'
import {Store, Action} from '@ngrx/store'
import {ApiService} from 'angular2-api'
import {TeamApi} from 'api/Team'
import {ITeamStore} from 'shared/reducers/team'
import {ADD_API_ERROR} from 'shared/actions/error'
import {
  FETCH_TEAMS,
  FETCHING_TEAMS,
  FETCHED_TEAMS,
  CREATE_TEAM,
  CREATING_TEAM,
  CREATED_TEAM,
  CREATE_TEAM_ERROR
} from 'shared/actions/team'

@Injectable()
export class Teams {
  public errors: Observable<any[]>
  public items: Observable<any[]>
  private _actions: BehaviorSubject<Action> = new BehaviorSubject<Action>({type: null, payload: null})

  constructor(private _api: ApiService, private _teamApi: TeamApi, _store: Store<any>) {
    var store = _store.select<ITeamStore>('team')

    this.errors = store.map(({createErrors}: ITeamStore) => createErrors)
    this.items = store.map(({teams}: ITeamStore) => teams)

    let createTeam = this._actions
      .filter(({type}: Action) => type === CREATE_TEAM)
      .do(() => _store.dispatch({type: CREATING_TEAM}))
      .mergeMap(({payload}: Action) => this._createTeam(payload))

    let fetchTeams = this._actions
      .filter(({type}: Action) => type === FETCH_TEAMS)
      .do(() => _store.dispatch({type: FETCHING_TEAMS}))
      .mergeMap(({payload}: Action) => this._fetchTeams(payload))

    Observable.merge(createTeam, fetchTeams)
      .subscribe((action: Action) => _store.dispatch(action))
  }

  public create(team): void {
    this._actions.next({type: CREATE_TEAM, payload: team})
  }

  public findAll(): void {
    this._actions.next({type: FETCH_TEAMS})
  }

  private _fetchTeams(params?: any): Observable<Action> {
    return this._api.findAll(this._teamApi, params)
      .map(teamMembers => ({type: FETCHED_TEAMS, payload: teamMembers}))
      .catch(error => Observable.of({type: ADD_API_ERROR, payload: error}))
  }

  private _createTeam(data): Observable<Action> {
    return this._teamApi.create(data)
      .map(team => ({type: CREATED_TEAM, payload: team}))
      .catch(error => Observable.of({type: CREATE_TEAM_ERROR, payload: error}))
  }
}
