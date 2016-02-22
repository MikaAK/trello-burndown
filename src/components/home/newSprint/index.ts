import {Component, Output, EventEmitter} from 'angular2/core'
import {Modal, ModalConfig} from 'directives/modal'
import {FormSave} from 'directives/formSave'
import {TeamApi} from 'api/team'
import {SprintApi} from 'api/sprint'
import {Observable} from 'rxjs/Observable'

interface ISprint {
  team: any,
  boardId: string,
  holidays: string,
  teamId?: number
}

const DEFAULT_SPRINT: ISprint = {
  team: null,
  boardId: '',
  holidays: ''
}

@Component({
  selector: 'new-sprint',
  template: require('./newSprint.jade')(),
  styles: [require('./newSprint.scss')],
  directives: [FormSave, Modal]
})
export class NewSprintComponent {
  @Output() public onSave: EventEmitter<any> = new EventEmitter()
  @Output() public onCancel: EventEmitter<any> = new EventEmitter()

  public modal: ModalConfig
  public newSprint: ISprint
  public teams: any[]
  public fetchTeams: Observable<any>

  constructor(public team: TeamApi, public sprint: SprintApi) {
    this.modal = new ModalConfig()
    this.newSprint = DEFAULT_SPRINT
    this.fetchTeams = team.findAll()
  }

  public getTeams() {
    this.fetchTeams.subscribe(teams => this.teams = teams)
  }

  public save() {
    var holidays = this.newSprint.holidays
      .split(',')
      .map(str => str.trim())

    this.newSprint.teamId = this.newSprint.team.id

    debugger
    this.sprint.create(Object.assign({}, this.newSprint, {holidays, team: null}))
      .subscribe(newSprint => {
        debugger
        this.onSave.emit('event')
      })
  }

  public cancel() {
    this.newSprint = DEFAULT_SPRINT
    this.onCancel.emit('event')
  }
}
