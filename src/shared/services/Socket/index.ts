
import {Injectable} from 'angular2/core'
import {Observable} from 'rxjs/Observable'
import {Socket as PhoenixSocket, Channel, SocketOptions} from 'phoenix-ts'
import {Store} from '@ngrx/store'
import {ADD_SPRINTS} from 'shared/actions/sprint'
import {deserializeKeys} from 'api/helpers'
import {Config} from 'config'

export interface ISocketsConfig {
  url?: string
  options?: SocketOptions
}

@Injectable()
export class SocketsConfig implements ISocketsConfig {
  public url: string = Config.websocketUrl
  public options: SocketOptions
}

@Injectable()
export class Sockets {
  private _channels: Channel[] = []
  private _socket: PhoenixSocket

  constructor(socketConfig: SocketsConfig, store: Store<any>) {
    this._socket = new PhoenixSocket(socketConfig.url || '/ws', socketConfig.options)
    this._socket.connect()

    let channel = this._socket.channel('model_change:create')

    console.log('connecting to channel')
    channel.on('sprint', function(sprint) {
      store.dispatch({type: ADD_SPRINTS, payload: deserializeKeys(sprint.data)})
    })

    channel.join()
      .receive('ok', ({messages}) => console.log('catching up', messages) )
      .receive('error', ({reason}) => console.log('failed join', reason) )
      .receive('timeout', () => console.log('Networking issue. Still waiting...') )
  }

  public channel(channelName, params) {
    const channel = this._socket.channel(channelName, params)
  }
}
