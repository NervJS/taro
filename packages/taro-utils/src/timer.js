const TIMER_TIMEOUT = 1
const TIMER_INTERVAL = 2

export default class Timer {
  constructor (type, ms) {
    this.type = type
    this.ms = ms
    this.handler = null
  }

  static delay (ms) {
    return new Timer(TIMER_TIMEOUT, ms)
  }

  static period (ms) {
    return new Timer(TIMER_INTERVAL, ms)
  }

  run (fn, ...args) {
    this.clear()

    if (this.type === TIMER_TIMEOUT) {
      this.handler = setTimeout(fn, this.ms, ...args)
      return true
    } else if (this.type === TIMER_INTERVAL) {
      this.handler = setInterval(fn, this.ms, ...args)
      return true
    }
    return false
  }

  clear () {
    if (this.handler) {
      if (this.type === TIMER_TIMEOUT) {
        clearTimeout(this.handler)
      } else if (this.type === TIMER_INTERVAL) {
        clearInterval(this.handler)
      }
    }
  }
}
