import 'angular2/web_worker/worker.js'
import {WORKER_RENDER_PLATFORM, WORKER_RENDER_APPLICATION, WORKER_SCRIPT} from 'angular2/platform/worker_render'
import {platform, enableProdMode} from 'angular2/core'
import {WORKER_APP_PLATFORM, WORKER_APP_APPLICATION} from 'angular2/platform/worker_app'

import {AppComponent} from './app'

// Environments don't work for some reason yet
if (__PROD__ || __STAGING__)
  enableProdMode()
               
platform([WORKER_RENDER_PLATFORM])
  .application([WORKER_RENDER_APPLICATION)

platform([WORKER_APP_PLATFORM])
  .application([WORKER_APP_APPLICATION])
  .then((ref) => ref.bootstrap(AppComponent))
