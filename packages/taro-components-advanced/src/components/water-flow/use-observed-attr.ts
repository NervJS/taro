import { useCallback, useSyncExternalStore } from 'react'

import { StatefulEventBus } from './stateful-event-bus'

export function useObservedAttr<
  T extends StatefulEventBus<any>,
  K extends keyof T['state']
>(
  inst: T,
  attr: K
): T['state'][K] {
  const sub = useCallback(
    (onStoreChange: () => void) => {
      return inst.sub(attr, onStoreChange)
    },
    [inst, attr]
  )

  const getSnapshot = useCallback(() => {
    if ('getState' in inst && typeof inst.getState === 'function') {
      const state = inst.getState()
      if (state && attr in state) {
        return state[attr as keyof typeof state]
      }
    }
    return inst[attr]
  }, [inst, attr])

  return useSyncExternalStore(sub, getSnapshot, getSnapshot)
}
