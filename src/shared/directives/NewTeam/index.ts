import {Component, Output, EventEmitter, ViewChild} from 'angular2/core'
import {ControlGroup, FormBuilder, Validators, NgForm} from 'angular2/common'
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject'
import {Action, Dispatcher} from '@ngrx/store'

import {Teams} from 'shared/services/Teams'
import {Modal, ModalService} from 'shared/directives/Modal'
import {FormSave} from 'shared/directives/FormSave'
import {CREATED_TEAM} from 'shared/actions/team'

interface ITeamMember {
  trelloId: string
  velocity: number
}

interface ITeam {
  name: string
  teamMembers: ITeamMember[]
}

const DEFAULT_TEAM_MEMBER: ITeamMember = {
  trelloId: '',
  velocity: 2
}

const DEFAULT_TEAM = {
  name: '',
  teamMembers: []
}

const ADD_TEAM_MEMBER = 'NEW_TEAM:ADD_TEAM_MEMBER'
const REMOVE_TEAM_MEMBER = 'NEW_TEAM:REMOVE_TEAM_MEMBER'
const RESET_TEAM = 'NEW_TEAM:RESET_TEAM'
const CLOSE_NEW_TEAM = 'NEW_TEAM:CLOSE_NEW_TEAM'

@Component({
  selector: 'new-team',
  template: require('./NewTeam.jade')(),
  styles: [require('./NewTeam.scss')],
  directives: [Modal, FormSave, NgForm],
  providers: [Teams, ModalService, FormBuilder]
})
export class NewTeam {
  @Output() public onClose: EventEmitter<any> = new EventEmitter()
  public newTeamForm: ControlGroup
  public newTeam: ITeam = Object.assign({}, DEFAULT_TEAM)
  private _actions: BehaviorSubject<Action> = new BehaviorSubject<Action>({type: '', payload: ''})

  constructor(public modalService: ModalService, public teams: Teams, dispatcher: Dispatcher<Action>, fb: FormBuilder) {
    this._actions
      .filter(({type}: Action) => type === ADD_TEAM_MEMBER)
      .subscribe(() => this.newTeam.teamMembers.push(Object.assign({}, DEFAULT_TEAM_MEMBER)))

    this._actions
      .filter(({type}: Action) => type === REMOVE_TEAM_MEMBER)
      .subscribe(({payload}: Action) => this.newTeam.teamMembers.splice(payload, 1))

    this._actions
      .filter(({type}: Action) => type === RESET_TEAM)
      .subscribe(() => this.newTeam = Object.assign({}, DEFAULT_TEAM))

    this._actions
      .filter(({type}: Action) => type === CLOSE_NEW_TEAM)
      .subscribe(() => modalService.close())

    this.newTeamForm = fb.group({
      name: ['', Validators.required]
    })

    dispatcher
      .filter(({type}: Action) => type === CREATED_TEAM)
      .filter(() => !!this.newTeam.teamMembers.length)
      .subscribe(() => this.modalService.close())
  }

  public addTeamMember() {
    console.log('add member')
    this._actions.next({type: ADD_TEAM_MEMBER})
  }

  public removeTeamMember(index) {
    this._actions.next({type: REMOVE_TEAM_MEMBER})
  }

  public reset() {
    this._actions.next({type: RESET_TEAM})
  }

  public close() {
    this._actions.next({type: CLOSE_NEW_TEAM})
  }
}
