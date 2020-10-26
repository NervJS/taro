import { options } from './options'

class Performance {
  private recorder = new Map<string, number>()

  public start (id: string) {
    if (!options.debug) {
      return
    }
    this.recorder.set(id, Date.now())
  }

  public stop (id: string) {
    if (!options.debug) {
      return
    }
    const now = Date.now()
    const prev = this.recorder.get(id)!
    const time = now - prev
    // eslint-disable-next-line no-console
    console.log(`${id} 时长： ${time}ms`)
  }
}

export const perf = new Performance()
