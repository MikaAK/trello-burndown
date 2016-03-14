var childProcess = require('child_process'),
    path = require('path')

const spawnPromise = function(command, commandArgs, cwd, isSync) {
  var child
  var params = {
    stdio: 'inherit'
  }

  if (cwd)
    params.cwd = cwd

  return new Promise(function(resolve, reject) {
    if (isSync) {
      child = childProcess.spawnSync(command, commandArgs, params)
      if (child.error || child.status === 1)
        reject(child.error)
      else
        resolve()
    } else {
      child = childProcess.spawn(command, commandArgs, params).on('close', function(code) {
        if (!code)
          resolve()
        else
          reject(child.error)
      })
    }
  })
}

export {spawnPromise}
