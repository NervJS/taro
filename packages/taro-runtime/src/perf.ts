import { options } from './options'
import { debounce } from './utils'

import type { TFunc } from './interface'

class Performance {
  private recorder = new Map<string, number>()

  public start (id: string) {
    if (!options.debug) {
      return
    }
    this.recorder.set(id, Date.now())
  }

  public stop (id: string, now = Date.now()) {
    if (!options.debug) {
      return
    }
    const prev = this.recorder.get(id)!
    if (!(prev >= 0)) return

    this.recorder.delete(id)
    const time = now - prev
    // eslint-disable-next-line no-console
    console.log(`${id} 时长： ${time}ms 开始时间：${this.#parseTime(prev)} 结束时间：${this.#parseTime(now)}`)
  }

  public delayStop (id: string, delay = 500) {
    if (!options.debug) {
      return
    }

    return debounce((now = Date.now(), cb?: TFunc) => {
      this.stop(id, now)
      cb?.()
    }, delay)
  }

  #parseTime (time: number) {
    const d = new Date(time)
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${`${d.getMilliseconds()}`.padStart(3, '0')}`
  }
}

export const perf = new Performance()
