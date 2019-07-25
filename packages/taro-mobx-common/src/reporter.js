class EventEmitter {
  listeners = []

  on (cb) {
    this.listeners.push(cb)
    return () => {
      const index = this.listeners.indexOf(cb)
      if (index !== -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  emit (data) {
    this.listeners.forEach(fn => fn(data))
  }
}

export const errorsReporter = new EventEmitter()
