import {Observable} from 'rxjs/Observable'

export const openWindow = (url, onComplete: ((win: Window, event?: any) => any|void)): (() => void) => {
  const newWin = window.open(url)

  const timer = Observable.interval(200)
    .subscribe(() => {
      if (newWin.closed) {
        exitWindow()
        onComplete(newWin)
      }
    })

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

  window.addEventListener('message', onMessage)

  return exitWindow
}
