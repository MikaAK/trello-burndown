import {Component, Output, EventEmitter, ViewChild} from 'angular2/core'
import {ControlGroup, FormBuilder, Validators} from 'angular2/common'
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject'
import {Action, Dispatcher} from '@ngrx/store'

import {Teams} from 'shared/services/Teams'
import {Modal, ModalService} from 'shared/directives/Modal'
import {FormSave} from 'shared/directives/FormSave'

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

const CREATE_TEAM = 'NEW_TEAM:ADD_TEAM_MEMBER'
const ADD_TEAM_MEMBER = 'NEW_TEAM:ADD_TEAM_MEMBER'
const REMOVE_TEAM_MEMBER = 'NEW_TEAM:REMOVE_TEAM_MEMBER'

@Component({
  selector: 'new-team',
  template: require('./NewTeam.jade')(),
  styles: [require('./NewTeam.scss')],
  directives: [Modal, FormSave],
  providers: [Teams, ModalService, FormBuilder]
})
export class NewTeam {
  @Output() public onClose: EventEmitter<any> = new EventEmitter()
  public newTeamForm: ControlGroup
  public newTeam: ITeam = Object.assign(DEFAULT_TEAM )
  private _actions: BehaviorSubject<Action> = new BehaviorSubject<Action>({type: '', payload: ''})

  constructor(public modalService: ModalService, public teams: Teams, fb: FormBuilder) {
    this._actions
      .filter(({type}: Action) => type === ADD_TEAM_MEMBER)
      .subscribe(() => this.newTeam.teamMembers.push(Object.assign({}, DEFAULT_TEAM_MEMBER)))

    this._actions
      .filter(({type}: Action) => type === REMOVE_TEAM_MEMBER)
      .subscribe(({payload}: Action) => this.newTeam.teamMembers.splice(payload, 1))

    this._actions
      .filter(({type}: Action) => type === CREATE_TEAM)
      .subscribe(() => this.teams.create(this.newTeam))
    // this.newTeamForm = fb.group({
    //   name: ['', Validators.required],
    //   teamMembers: ([
    //     'trelloId', ['', Validators.required],
    //     'velocity', [0, Validators.required],
    //   ], Validators.required)
    // })
  }

  public addTeamMember() {
    this._actions.next({type: ADD_TEAM_MEMBER})
  }

  public removeTeamMember(index) {
    this._actions.next({type: REMOVE_TEAM_MEMBER})
  }

  public save() {
    this._actions.next({type: CREATE_TEAM})
  }

  public cancel() {
    // this.resetTeam()
    // this.modalService.toggle()
    // this.onClose.emit('emit')
  }
}
