import { options } from './options'
import { debounce } from './utils'

import type { TFunc } from './interface'

class Performance {
  private recorder = new Map<string, number>()
  private setDataCounter = 0
  private setDataTimer: NodeJS.Timeout | null = null

  constructor() {
    // eslint-disable-next-line no-console
    console.log('[Taro]: 可通过 Taro.options.debug = true 开启Taro性能检测日志')
  }

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
    console.log(`[Taro] ${id} 时长： ${time}ms 开始时间：${this.#parseTime(prev)} 结束时间：${this.#parseTime(now)}`)
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

  public checkSetData(ctx, data: any) {
    if (!options.debug) {
      return
    }

    this.#checkSetDataFrequency()
    this.#checkSetDataSize(data)
    this.#checkSetDataPath(data)
    this.#checkSetDataUnuse(ctx)
  }

  #checkSetDataUnuse(ctx) {
    if (ctx.__hasReportHide__) {
      console.warn(`[Taro]: 后台页面存在setData调用，会抢占前台页面的运行资源，请尽量避免此情况`)
    }
  }

  #checkSetDataPath(data: any = {}) {
    const maxLength = options.perfConfig.maxDataPathLength
    const keys = Object.keys(data)
    keys.forEach(item => {
      const length = item.split('.').filter(name => name === 'cn').length - 1 // 页面根节点是root.cn.[0]，减去这一层
      if (length >= maxLength) {
        console.warn(`[Taro]: 单次setData数据层级超过${maxLength}层(${length})，请检查是否可通过CustomWrapper优化，以提升更新性能。(key: ${item})`)
      }
    })
  }

  #checkSetDataSize(data: any = {}) {
    const maxSize = options.perfConfig.maxDataSize
    let length = 0
    try {
      // 小程序不支持Blob和TextEncoder
      length = unescape(encodeURIComponent(JSON.stringify(data))).length
    } catch (error) {
      length = JSON.stringify(data).length * 2 // 估算
    }

    const size = (length / 1024).toFixed(2)
    if (parseFloat(size) >= maxSize) {
      console.warn(`[Taro]: 单次setData数据在JSON.stringify后长度大于${maxSize}KB(${size})，这可能会影响性能，请检查数据更新逻辑是否可优化。`)
    }
  }

  #resetSetDataFrequency() {
    this.setDataCounter = 0
    clearTimeout(this.setDataTimer as NodeJS.Timeout)
    this.setDataTimer = null
  }

  #checkSetDataFrequency() {
    const maxCountPerSec = options.perfConfig.maxSetDataFrequency
    this.setDataCounter++

    if (this.setDataTimer === null) {
      this.setDataTimer = setTimeout(() => {
        this.#resetSetDataFrequency()
      }, 1000)
    }

    if (this.setDataCounter >= maxCountPerSec) {
      this.#resetSetDataFrequency()
      console.warn(`[Taro]: setData 调用频率过高（1秒内执行了${maxCountPerSec}次及以上），这可能会影响性能，请检查数据更新逻辑是否可优化。`)
    }
  }

  #parseTime (time: number) {
    const d = new Date(time)
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${`${d.getMilliseconds()}`.padStart(3, '0')}`
  }
}

export const perf = new Performance()
