declare const __DEV__: boolean

import {Headers} from 'angular2/http'
import * as _ from 'lodash'

const convertKeys = function(convertFn): any|any[] {
  var convert = function(params) {
    if (Array.isArray(params))
      return _.map(params, convert)
    else if (params && typeof params === 'object') {
      return _.reduce(params, function(res, value, key) {
          var nValue

          if (typeof value === 'object' || Array.isArray(value))
            nValue = convert(value)
          else
            nValue = value

          res[convertFn(key)] = nValue

          return res
        }, {})
    } else
      return params
  }

  return convert
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
}

const objToQueryParams = function(obj) {
  var str = []

  for (let p in obj)
    if (obj.hasOwnProperty(p))
      str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`)

  return str.join('&')
}

const API_BASE = 'api/'

const log = function(...args) {
  if (__DEV__)
    console.log.apply(console, args)
}

const setHeaders = function(params) {
  var headers

  if (params && params.header)
    headers = new Headers(_.extend(params.headers, DEFAULT_HEADERS))
  else
    headers = new Headers(DEFAULT_HEADERS)

  return params ? _.extend(params, {headers}) : {headers}
}

const toJSON = function(data) {
  return data ? JSON.stringify(data) : data
}

const serializeKeys: any|any[] = convertKeys(_.snakeCase)
const deserializeKeys: any|any[] = convertKeys(_.camelCase)

const serializeParamKeys = function(params): Object {
  if (params.params)
    params.params = serializeKeys(params.params)

  return params
}

export {objToQueryParams, log, setHeaders, toJSON, API_BASE, serializeParamKeys, serializeKeys, deserializeKeys}
