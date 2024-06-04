import { noop } from '@tarojs/shared'
import { batch } from 'solid-js'

export function flushSync () {
  batch(noop)
}

export function unstable_batchedUpdates (fn) {
  batch(fn)
}
