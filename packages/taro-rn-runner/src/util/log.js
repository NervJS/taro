const chalk = require('chalk')

function log (data) {
  const args = Array.prototype.slice.call(arguments, 0)

  respectProgressBars(() => {
    console.log(...args)
  })
}

log.withTimestamp = function (data) {
  const prefix = chalk.dim(new Date().toLocaleTimeString()) + ':'
  const args = [prefix].concat(Array.prototype.slice.call(arguments, 0))

  respectProgressBars(() => {
    console.log(...args)
  })
}

let _bundleProgressBar
log.setBundleProgressBar = function (bundleProgressBar) {
  _bundleProgressBar = bundleProgressBar
}

function respectProgressBars (commitLogs) {
  if (_bundleProgressBar) {
    _bundleProgressBar.terminate()
    _bundleProgressBar.lastDraw = ''
    commitLogs()
    _bundleProgressBar.render()
  } else {
    commitLogs()
  }
}

module.exports = log
