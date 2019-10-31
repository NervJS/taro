import { TaroElement } from '@tarojs/runtime'
import { OpaqueRoot } from 'react-reconciler'
import { ReactNode } from 'react'
import { TaroReconciler } from './reconciler'

type Renderer = typeof TaroReconciler

export type Callback = () => void | null | undefined

export class Root {
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
