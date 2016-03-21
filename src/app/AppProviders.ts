import {provide} from 'angular2/core'
import {serializeKeys, deserializeKeys} from 'api/helpers'

import {ROUTER_PROVIDERS} from 'angular2/router'
import {HTTP_PROVIDERS} from 'angular2/http'
import {API_PROVIDERS} from 'api'
import {STORE_PROVIDERS} from 'shared/store'
import {SOCKET_PROVIDERS} from 'shared/socket'

import {Locker, LockerConfig, DRIVERS} from 'angular2-locker'
import {ApiService, ApiConfig} from 'angular2-api'
import {Auth} from 'shared/services/Auth'
import {Sockets, SocketsConfig} from 'shared/services/Socket'

export const APP_PROVIDERS = [
  // Providers
  ...HTTP_PROVIDERS,
  ...ROUTER_PROVIDERS,
  ...API_PROVIDERS,
  ...STORE_PROVIDERS,
  ...SOCKET_PROVIDERS,

  // Configs
  SocketsConfig,
  provide(ApiConfig, {
    useValue: new ApiConfig({
      basePath: '/api',

      deserialize(data) {
        return deserializeKeys('data' in data ? data.data : data)
      },

      serialize(data) {
        return serializeKeys(data)
      },

      serializeParams(params) {
        // if (params && params.params)
          // params.search = serializeKeys(params.params)

        return params
      }
    })
  }),
  provide(LockerConfig, {
    useValue: new LockerConfig('burndown', DRIVERS.LOCAL)
  }),

  // Services
  ApiService,
  Locker,
  Sockets,
  Auth
]
