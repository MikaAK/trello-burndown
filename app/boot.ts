require('./style/global.scss')import 'reflect-metadata'import {AppComponent} from './components/app'import {bootstrap, ELEMENT_PROBE_PROVIDERS}    from 'angular2/platform/browser'import {enableProdMode} from 'angular2/core'import {ROUTER_PROVIDERS} from 'angular2/router'import {HTTP_PROVIDERS} from 'angular2/http'// Environments don't work for some reason yetif (window['__PROD__'] || window['__STAGING__'])  enableProdMode()bootstrap(AppComponent, [  ...(window['__PROD__'] ? [] : ELEMENT_PROBE_PROVIDERS)  ...HTTP_PROVIDERS  ...ROUTER_PROVIDERS])