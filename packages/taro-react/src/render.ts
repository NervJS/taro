import { TaroElement } from '@tarojs/runtime'
import { ReactNode } from 'react'
import { TaroReconciler } from './reconciler'
import { Callback, Root } from './root'

export const ContainerMap: WeakMap<TaroElement, Root> = new WeakMap()

export function render (element: ReactNode, domContainer: TaroElement, cb: Callback) {
  const oldRoot = ContainerMap.get(domContainer)
  if (oldRoot != null) {
    return oldRoot.render(element, cb)
  }

  const root = new Root(TaroReconciler, domContainer)
  ContainerMap.set(domContainer, root)
  return root.render(element, cb)
}
