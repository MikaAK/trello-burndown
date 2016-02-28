import * as _ from 'lodash'
import {Component, Output, EventEmitter} from 'angular2/core'
import {Modal, ModalConfig} from 'shared/directives/Modal'
import {FormSave} from 'shared/directives/FormSave'
import {TeamApi} from 'api/Team'
import {SprintApi} from 'api/Sprint'
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
  template: require('./NewSprint.jade')(),
  styles: [require('./NewSprint.scss')],
  directives: [FormSave, Modal]
})
export class NewSprintComponent {
  @Output() public onSave: EventEmitter<any> = new EventEmitter()
  @Output() public onCancel: EventEmitter<any> = new EventEmitter()

  public modal: ModalConfig
  public newSprint: ISprint
  public teams: any[]
  public fetchTeams: Observable<any>
  public error: string

  constructor(_team: TeamApi, private _sprint: SprintApi) {
    this.modal = new ModalConfig()
    this.newSprint = DEFAULT_SPRINT
    this.fetchTeams = _team.findAll()
    this.error = ''
  }

  public getTeams() {
    this.fetchTeams.subscribe(teams => this.teams = teams)
  }

  public save() {
    var holidays = this.newSprint.holidays
      .split(',')
      .map(str => str.trim())

    var params = {
      holidays,
      teamId: _.find(this.teams, {name: this.newSprint.team}).id,
      boardId: this.newSprint.boardId
    }

    this._sprint.create(params)
      .subscribe({
        complete: () => {
          this.modal.close()
          this.onSave.emit('event')
        },
        error: error => this.error = error.text()
      })
  }

  public cancel() {
    this.newSprint = DEFAULT_SPRINT
    this.onCancel.emit('event')
  }
}
