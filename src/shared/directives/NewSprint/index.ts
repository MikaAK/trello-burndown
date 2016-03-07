import * as _ from 'lodash'
import {Component, Output, EventEmitter} from 'angular2/core'
import {FormBuilder, Validators, ControlGroup, NgForm} from 'angular2/common'
import {Observable} from 'rxjs/Observable'
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject'
import {Action, Dispatcher} from '@ngrx/store'

import {TeamApi} from 'api/Team'
import {SprintApi} from 'api/Sprint'
import {Modal, ModalService} from 'shared/directives/Modal'
import {FormSave} from 'shared/directives/FormSave'
import {SprintService} from 'shared/services/Sprint'
import {TeamService} from 'shared/services/Team'
import {CREATED_SPRINT} from 'shared/actions/sprint'
import {ErrorDisplay} from '../ErrorDisplay'

const CREATE_SPRINT = 'CREATE_SPRINT'

@Component({
  selector: 'new-sprint',
  template: require('./NewSprint.jade')(),
  styles: [require('./NewSprint.scss')],
  directives: [FormSave, Modal, NgForm, ErrorDisplay],
  providers: [TeamService, SprintService, ModalService]
})
export class NewSprint {
  @Output() public onSave: EventEmitter<any> = new EventEmitter()
  @Output() public onCancel: EventEmitter<any> = new EventEmitter()

  public newSprintForm: ControlGroup 
  private _actions: BehaviorSubject<Action> = new BehaviorSubject<Action>({type: null, payload: null})

  constructor(
    public modalService: ModalService,
    public sprintService: SprintService,
    public teamService: TeamService,
    fb: FormBuilder,
    dispatcher: Dispatcher<any>
  ) {
    this.newSprintForm = fb.group({
      boardId: ['', Validators.required],
      holidays: [''],
      teamName: ['', Validators.required]
    })

    dispatcher
      .filter(({type}: Action) => type === CREATED_SPRINT)
      .subscribe(() => this.modalService.close())

    this._actions
      .filter(({type}: Action) => type === CREATE_SPRINT)
      .mergeMap(sprint => this._serialize(this.newSprintForm.value))
      .subscribe(sprint => this.sprintService.create(sprint))
  }

  public createSprint() {
    this._actions.next({type: CREATE_SPRINT})
  }

  public cancel() {
    this.onCancel.emit('event')
  }

  private _serialize(data): Observable<any> {
    let holidays = _(data.holidays.split(',')) 
      .map(_.trim)
      .compact()
      .value()

    let params = {
      holidays,
      boardId: data.boardId,
      teamId: null
    }

    return this.teamService.teams
      .map(teams => _.find(teams, {name: data.teamName}))
      .map(team => {
        if (team)
          params.teamId = team.id

        return params
      })
  }
}
