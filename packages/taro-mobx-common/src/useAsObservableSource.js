import { observable, runInAction } from 'mobx'
import { isPlainObject } from './utils'

export function useAsObservableSourceInternal (current, usedByLocalStore, useState) {
  const culprit = usedByLocalStore ? 'useLocalStore' : 'useAsObservableSource'
  if (usedByLocalStore && current === undefined) {
    return undefined
  }
  if (process.env.NODE_ENV !== 'production' && !isPlainObject(current)) {
    throw new Error(
      `${culprit} expects a plain object as ${usedByLocalStore ? 'second' : 'first'} argument`
    )
  }
  const [res] = useState(() => observable(current, {}, { deep: false }))
  if (
    process.env.NODE_ENV !== 'production' &&
    Object.keys(res).length !== Object.keys(current).length
  ) {
    throw new Error(`the shape of objects passed to ${culprit} should be stable`)
  }
  runInAction(() => {
    Object.assign(res, current)
  })
  return res
}

export function useAsObservableSource (current, useState) {
  return useAsObservableSourceInternal(current, false, useState)
}
