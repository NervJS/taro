import { defaultReconciler, isArray } from '@tarojs/shared'
import SERVICE_IDENTIFIER from '../constants/identifiers'

import type { Container } from 'inversify'

export default function processPluginHooks (container: Container) {
  const keys = Object.keys(defaultReconciler)
  keys.forEach(key => {
    if (key in SERVICE_IDENTIFIER) {
      // is hooks
      const identifier = SERVICE_IDENTIFIER[key]
      const fn = defaultReconciler[key]

      if (isArray(fn)) {
        // is multi
        fn.forEach(item => container.bind(identifier).toFunction(item))
      } else {
        if (container.isBound(identifier)) {
          // 之前有绑定过，需要重新绑定以覆盖前者
          container.rebind(identifier).toFunction(fn)
        } else {
          container.bind(identifier).toFunction(fn)
        }
      }
    }
  })
}
