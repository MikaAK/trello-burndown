import {Injectable} from 'angular2/core'
import {Observable} from 'rxjs/Observable'
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject'
import {Store, Action} from '@ngrx/store'
import {ApiService} from 'angular2-api'
import {SprintApi} from 'api/Sprint'
import {TrelloApi} from 'api/Trello'
import {ISprintStore} from 'shared/reducers/sprint'
import {ADD_API_ERROR} from 'shared/actions/error'
import {
  FETCH_SPRINTS,
  FETCH_SPRINT,
  FETCHING_SPRINTS,
  FETCHED_SPRINTS,
  CREATE_SPRINT,
  CREATING_SPRINT,
  CREATED_SPRINT,
  CREATE_SPRINT_ERROR
} from 'shared/actions/sprint'


const getCards = function(lists: any[], onlyPointed = true): any[] {
  return _(lists)
    .map('cards')
    .flatten()
    .compact()
    .filter((card: any) => !onlyPointed || card.points)
    .value()
}

const calculatePoints = function(cards: any[]): number {
  return _(cards)
    .map('points')
    .sum()
}

const splitCards = (sprint: any): any => {
  if (!sprint.board || !sprint.board.lists)
    return sprint

  var completedLists: any[] = sprint.board.lists
    .filter(list => /done!/i.test(list.name))

  var devCompletedLists: any[] = sprint.board.lists
    .filter(list => /signoff|completed|stage/i.test(list.name))

  var bugLists: any[] = sprint.board.lists
    .filter(list => /bugs?/i.test(list.name) && !/extra/.test(list.name))

  var uncompletedLists: any[] = _.without(sprint.board.lists, ...completedLists, ...devCompletedLists, ...bugLists)
    .filter(list => !/defered/i.test(list.name))

  sprint.completedCards = getCards(completedLists)
  sprint.completedPoints = calculatePoints(sprint.completedCards)

  sprint.uncompletedCards = getCards(uncompletedLists)
  sprint.uncompletedPoints = calculatePoints(sprint.uncompletedCards)

  sprint.devCompletedCards = getCards(devCompletedLists)
  sprint.devCompletedPoints = calculatePoints(sprint.devCompletedCards)

  sprint.bugCards = getCards(bugLists, false)
  sprint.totalPoints = sprint.devCompletedPoints + sprint.uncompletedPoints + sprint.completedPoints

  return sprint
}

@Injectable()
export class Sprints {
  public errors: Observable<any[]>
  public items: Observable<any[]>
  public isFetching: Observable<boolean>
  public isCreating: Observable<boolean>

  private _actions: BehaviorSubject<Action> = new BehaviorSubject<Action>({type: null, payload: null})

  constructor(private _api: ApiService, private _trelloApi: TrelloApi, private _sprintApi: SprintApi, _store: Store<any>) {
    var store = _store.select<ISprintStore>('sprint')

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

    Observable.merge(createSprint, fetchSprints, fetchSprint)
      .subscribe((action: Action) => _store.dispatch(action))
  }

  public create(sprint): void {
    this._actions.next({type: CREATE_SPRINT, payload: sprint})
  }

  public findAll() {
    this._actions.next({type: FETCH_SPRINTS})
  }

  public find(id: string|number, params?: any) {
    this._actions.next({type: FETCH_SPRINT, payload: [id, params]})
  }

  private _fetchSprint(id, params): Observable<Action> {
    return this._api.find(this._sprintApi, id, params)
      .mergeMap(sprint => this._attachBoardToSprint(sprint))
      .map(sprint => ({type: FETCHED_SPRINTS, payload: [sprint]}))
      .catch(error => Observable.of({type: ADD_API_ERROR, payload: error}))
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