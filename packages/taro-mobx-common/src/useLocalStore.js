import { observable, transaction, runInAction } from 'mobx'
import { useAsObservableSourceInternal } from './useAsObservableSource'
import { isPlainObject } from './utils'

export function useLocalStore (initializer, current, useState) {
  const source = useAsObservableSourceInternal(current, true, useState)
  return useState(() => {
    const local = observable(initializer(source))
    if (isPlainObject(local)) {
      runInAction(() => {
        Object.keys(local).forEach(key => {
          const value = local[key]
          if (typeof value === 'function') {
            local[key] = wrapInTransaction(value, local)
          }
        })
      })
    }
    return local
  })[0]
}

function wrapInTransaction (fn, context) {
  return (...args) => {
    return transaction(() => fn.apply(context, args))
  }
}
