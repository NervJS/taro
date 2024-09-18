import { noop } from '@tarojs/shared'

import { MutationObserverImpl, recordMutation } from './implements'
import { MutationRecord, MutationRecordType } from './record'

import type { TaroNode } from '../../dom/node'
import type { MutationCallback, MutationObserverInit } from './implements'

declare const ENABLE_MUTATION_OBSERVER: boolean

export class MutationObserver {
  core: Pick<MutationObserverImpl, 'observe' | 'disconnect' | 'takeRecords'>

  constructor (callback: MutationCallback) {
    if (ENABLE_MUTATION_OBSERVER) {
      this.core = new MutationObserverImpl(callback)
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Taro Warning] 若要使用 MutationObserver，请在 Taro 编译配置中设置 \'mini.runtime.enableMutationObserver: true\'')
      }
      this.core = {
        observe: noop,
        disconnect: noop,
        takeRecords: (noop as () => any)
      }
    }
  }

  public observe (...args: [TaroNode, MutationObserverInit?]) {
    this.core.observe(...args)
  }

  public disconnect () {
    this.core.disconnect()
  }

  public takeRecords () {
    return this.core.takeRecords()
  }

  static record (record: MutationRecord) {
    recordMutation(record)
  }
}

export {
  MutationRecordType
}
