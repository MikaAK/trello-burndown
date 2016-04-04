import {Observable} from 'rxjs/Observable'

import {openWindow} from './openWindow'

export const downloadFile = (name: string, data: string|File, type: string): Observable<any> => {
  const blob = new File([data], name, {type}),
        url = window.URL.createObjectURL(blob)

  return new Observable(observer => {
    var exitWindow = openWindow(url, () => observer.complete())

    return () => {
      window.URL.revokeObjectURL(url)
      exitWindow()
    }
  })
}
