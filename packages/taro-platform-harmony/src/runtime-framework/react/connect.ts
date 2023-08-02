import { hooks } from '@tarojs/shared'

export function setReconciler (ReactDOM) {
  hooks.tap('batchedEventUpdates', function (cb) {
    ReactDOM.unstable_batchedUpdates(cb)
  })
}
