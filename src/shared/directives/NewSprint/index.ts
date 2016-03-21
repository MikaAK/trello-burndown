import * as _ from 'lodash'
import {Component, Output, EventEmitter} from 'angular2/core'
import {FormBuilder, Validators, ControlGroup, NgForm} from 'angular2/common'
import {Observable} from 'rxjs/Observable'
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject'
import {Action, Dispatcher} from '@ngrx/store'

import {Modal, ModalService} from 'shared/directives/Modal'
import {FormSave} from 'shared/directives/FormSave'
import {Sprints} from 'shared/services/Sprints'
import {Teams} from 'shared/services/Teams'
import {CREATED_SPRINT} from 'shared/actions/sprint'
import {ErrorDisplay} from '../ErrorDisplay'

interface INewSprint {
  boardId: string
  holidays: string
  team: any
}

const CREATE_SPRINT = 'NEW_SPRINT:CREATE_SPRINT'
const CLOSE = 'NEW_SPRINT:CLOSE'
const RESET = 'NEW_SPRINT:RESET'

const DEFAULT_SPRINT: INewSprint = {
  boardId: '',
  holidays: '',
  team: null
}

@Component({
  selector: 'new-sprint',
  template: require('./NewSprint.jade')(),
  styles: [require('./NewSprint.scss')],
  directives: [FormSave, Modal, NgForm, ErrorDisplay],
  providers: [Teams, Sprints, ModalService]
})
export class NewSprint {
  @Output() public onSave: EventEmitter<any> = new EventEmitter()
  @Output() public onCancel: EventEmitter<any> = new EventEmitter()

  public newSprintForm: ControlGroup
  public newSprint: INewSprint = DEFAULT_SPRINT
  private _actions: BehaviorSubject<Action> = new BehaviorSubject<Action>({type: null, payload: null})

  constructor(
    public modalService: ModalService,
    public sprints: Sprints,
    public teams: Teams,
    fb: FormBuilder,
    dispatcher: Dispatcher<Action>
  ) {
    this.newSprintForm = fb.group({
      boardId: ['', Validators.required],
      holidays: [''],
      startDate: ['', Validators.required],
      teamName: ['', Validators.required]
    })

    dispatcher
      .filter(({type}: Action) => type === CREATED_SPRINT)
      .subscribe(() => this.modalService.close())

    this._actions
      .filter(({type}: Action) => type === CREATE_SPRINT)
      .mergeMap(sprint => this._serialize(this.newSprint))
      .subscribe(sprint => this.sprints.create(sprint))

    this._actions
      .filter(({type}: Action) => type === CLOSE)
      .subscribe(() => this.modalService.close())

    this._actions
      .filter(({type}: Action) => type === RESET)
      .subscribe(() => {
        // Implement form reset when possible
      })
  }

  public createSprint() {
    this._actions.next({type: CREATE_SPRINT})
  }

  public close() {
    this._actions.next({type: CLOSE})
  }

  public reset() {
    this._actions.next({type: RESET})
  }

  private _serialize(data): Observable<any> {
    let holidays = _(data.holidays.split(','))
      .map(_.trim)
      .compact()
      .value()

    let params = {
      holidays,
      boardId: data.boardId,
      startDate: data.startDate,
      teamId: null
    }

    return this.teams.items
      .take(1)
      .map(teams => _.find(teams, {name: data.teamName}))
      .map(team => {
        if (team)
          params.teamId = team.id

        return params
      })
  }
}
