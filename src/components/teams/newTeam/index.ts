import {Component, Output, EventEmitter} from 'angular2/core'
import {TeamApi} from 'api/team'
import {Modal, ModalConfig} from 'directives/modal'
import {FormSave} from 'directives/formSave'

interface INewTeam {
  name: string
  teamMembers: Array<any>
}

interface ITeamMember {
  trelloId: string
  velocity: number
}

const DEFAULT_TEAM: INewTeam = {
  name: '',
  teamMembers: []
}

const DEFAULT_TEAM_MEMBER: ITeamMember = {
  trelloId: '',
  velocity: 2
}

@Component({
  selector: 'new-team',
  template: require('./newTeam.jade')(),
  directives: [Modal, FormSave],
  styles: [require('./newTeam.scss')],
  providers: [TeamApi]
})
export class NewTeam {
  @Output() public onClose: EventEmitter<any> = new EventEmitter()
  public modal: ModalConfig
  public newTeam: INewTeam = DEFAULT_TEAM

  constructor(private _team: TeamApi) {
    this.modal = new ModalConfig()
  }

  public addTeamMember() {
    this.newTeam.teamMembers.push(Object.assign({}, DEFAULT_TEAM_MEMBER))
  }

  public removeTeamMember(index) {
    this.newTeam.teamMembers.splice(index, 1)
  }

  public resetTeam() {
    this.newTeam = DEFAULT_TEAM
  }

  public save() {
    return this._team.create(this.newTeam)
      .subscribe(() => this.cancel())
  }

  public cancel() {
    this.resetTeam()
    this.modal.toggle()
    this.onClose.emit('emit')
  }
}
