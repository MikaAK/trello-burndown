import {Observable} from 'rxjs/Observable'

export const openWindow = (url, onComplete: ((win: Window, event?: any) => any|void)) => {
  const newWin = window.open(url)
  const onMessage = (event) => {
    if (event && event.source !== newWin) 
      return
    else {
      exitWindow()
      onComplete(newWin, event)
    }
  }

  const exitWindow = () => {
    if (!newWin.closed)
      newWin.close()

    timer.unsubscribe()
    window.removeEventListener('message', onMessage)
  }

  const timer = Observable.interval(1000)
    .subscribe(() => {
      if (newWin.closed) {
        exitWindow()
        onComplete(newWin)
      }
    })

  window.addEventListener('message', onMessage)

  return exitWindow
}
