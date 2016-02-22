import {Observable} from 'rxjs/Observable'
import {ApiModel} from './ApiModel'

export class RestApi extends ApiModel {
  public find(id: number, params?: Object): Observable<any> {
    return this.GET(id.toString(), params)
  }

  public findAll(params?: Object): Observable<any> {
    return this.GET(null, params)
  }

  public create(data: Object, params?: Object): Observable<any> {
    return this.POST(null, data, params)
  }

  public update(data, params?: Object): Observable<any> {
    return this.PUT(null, data, params)
  }

  public destroy(id?: number|Object): Observable<any> {
    var params

    if (typeof id === 'object') {
      params = id
      id = null
    }

    return this.DELETE(id, params)
  }
}
