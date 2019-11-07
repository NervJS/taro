import { TaroElement } from '@tarojs/runtime'
import { ReactNode } from 'react'
import { TaroReconciler } from './reconciler'
import { OpaqueRoot } from 'react-reconciler'

export const ContainerMap: WeakMap<TaroElement, Root> = new WeakMap()

type Renderer = typeof TaroReconciler

export type Callback = () => void | null | undefined

class Root {
  private renderer: Renderer
  private internalRoot: OpaqueRoot

  public constructor (renderer: Renderer, domContainer: TaroElement) {
    this.renderer = renderer
    this.internalRoot = renderer.createContainer(domContainer, false, false)
  }

  public render (children: ReactNode, cb: Callback) {
    this.renderer.updateContainer(children, this.internalRoot, null, cb)

    return this.renderer.getPublicRootInstance(this.internalRoot)
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
