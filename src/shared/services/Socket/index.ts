import {Injectable} from 'angular2/core'
import {Observable} from 'rxjs/Observable'
import {Socket as PhoenixSocket, Channel, SocketOptions} from 'phoenix-ts'

export interface ISocketConfig {
  url?: string
  options?: SocketOptions
}

@Injectable()
export class SocketConfig implements ISocketConfig {
  public url: string = '/ws'
  public options: SocketOptions
}

@Injectable()
export class Socket {
  private _channels: Channel[] = []
  private _socket: PhoenixSocket

  constructor(socketConfig: SocketConfig) {
    this._socket = new PhoenixSocket(socketConfig.url || '/ws', socketConfig.options)
  }

  public channel(channelName, params) {
    const channel = this._socket.channel(channelName, params)
  }
}
