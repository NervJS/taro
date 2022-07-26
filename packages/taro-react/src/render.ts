import { TaroElement } from '@tarojs/runtime'
import { ReactNode } from 'react'
import { OpaqueRoot } from 'react-reconciler'

import { TaroReconciler } from './reconciler'

export const ContainerMap: WeakMap<TaroElement, Root> = new WeakMap()

type Renderer = typeof TaroReconciler

export type Callback = () => void | null | undefined

class Root {
  private renderer: Renderer
  private internalRoot: OpaqueRoot

  public constructor (renderer: Renderer, domContainer: TaroElement, isConcurrentRoot = false) {
    this.renderer = renderer
    /** ConcurrentRoot & LegacyRoot: react-reconciler/src/ReactRootTags.js */
    this.internalRoot = renderer.createContainer(domContainer, isConcurrentRoot ? 1 : 0, false, null)
  }

  public render (children: ReactNode, cb: Callback) {
    const { renderer, internalRoot } = this
    renderer.updateContainer(children, internalRoot, null, cb)
    return renderer.getPublicRootInstance(internalRoot)
  }

  public unmount (cb: Callback) {
    this.renderer.updateContainer(null, this.internalRoot, null, cb)
  }
}

export function render (element: ReactNode, domContainer: TaroElement, cb: Callback) {
  const oldRoot = ContainerMap.get(domContainer)
  if (oldRoot != null) {
    return oldRoot.render(element, cb)
  }

  const root = new Root(TaroReconciler, domContainer)
  ContainerMap.set(domContainer, root)
  return root.render(element, cb)
}

export function createRoot (domContainer: TaroElement) {
  const oldRoot = ContainerMap.get(domContainer)
  if (oldRoot != null) {
    return oldRoot
  }
  const root = new Root(TaroReconciler, domContainer, true)
  ContainerMap.set(domContainer, root)
  return root
}
