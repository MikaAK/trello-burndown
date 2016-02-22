import {Injectable} from 'angular2/core'
import {Http} from 'angular2/http'
import {API_BASE, log, setHeaders, toJSON, serializeKeys, deserializeKeys, serializeParamKeys} from './helpers'

const getDatas = function(res: any): any[] {
  return res.data
}

@Injectable()
export class ApiModel {
  public endpoint: string

  constructor(public http: Http) {}

  public createUrl(url?: string[]|string): string {
    var urlParams = Array.isArray(url) ? url.join('/') : url

    return API_BASE + this.endpoint + (this.endpoint.endsWith('/') ? '' : '/') + (urlParams || '')
  }

  public GET(url: string, params?: Object) {
    log('Creating Get Request: ', this.createUrl(url), params)

    params = serializeParamKeys(setHeaders(params))

    return this.http.get(this.createUrl(url), params)
      .map(item => item.json())
      .map(getDatas)
      .map(items => deserializeKeys(items))
      .map(items => items.map(item => this.deserialize(item)))
  }

  public POST(url: string, data?: Object, params?: Object) {
    log('Creating Post Request: ', this.createUrl(url), this.serialize(data), params)

    params = serializeParamKeys(setHeaders(params))

    return this.http.post(this.createUrl(url), toJSON(this.serialize(serializeKeys(data))), params)
      .map(item => item.json().data)
      .map(deserializeKeys)
      .map(item => this.deserialize(item))
  }

  public PUT(url: string, data?: Object, params?: Object) {
    log('Creating Put Request: ', this.createUrl(url), this.serialize(data), params)

    params = serializeParamKeys(setHeaders(params))

    return this.http.put(this.createUrl(url), toJSON(this.serialize(serializeKeys(data))), params)
      .map(item => item.json().data)
      .map(deserializeKeys)
      .map(item => this.deserialize(item))
  }

  public DELETE(url, params?: Object) {
    log('Creating Delete Request: ', this.createUrl(url), params)

    params = serializeParamKeys(setHeaders(params))

    return this.http.delete(this.createUrl(url), params)
      .map(item => item.json().data)
      .map(deserializeKeys)
      .map(item => this.deserialize(item))
  }

  private serialize(data) {
    return data
  }

  private deserialize(data) {
    return data
  }
}
