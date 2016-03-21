declare const __DEV__: boolean

export const Config = {
  websocketUrl: __DEV__ ? 'ws://localhost:3000/socket' : '/socket'
}
