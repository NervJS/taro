import { TaroNode } from '@tarojs/runtime'
import { hooks } from '@tarojs/shared'
import { batch } from 'solid-js'

export type Component = (props?: any) => TaroNode

export function setReconciler() {
  hooks.tap('batchedEventUpdates', function (cb) {
    batch(cb)
  })
}
