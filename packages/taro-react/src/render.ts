import { TaroElement } from '@tarojs/runtime'
import { ReactNode } from 'react'
import { OpaqueRoot } from 'react-reconciler'

import { TaroReconciler } from './reconciler'

export const ContainerMap: WeakMap<TaroElement, Root> = new WeakMap()

type Renderer = typeof TaroReconciler

type CreateRootOptions = {
  unstable_strictMode?: boolean
  unstable_concurrentUpdatesByDefault?: boolean
  unstable_transitionCallbacks?: any
  identifierPrefix?: string
  onRecoverableError?: (error: any) => void
}

export type Callback = () => void | null | undefined

class Root {
  private renderer: Renderer
  private internalRoot: OpaqueRoot

  public constructor (renderer: Renderer, domContainer: TaroElement, options?: CreateRootOptions) {
    this.renderer = renderer
    this.initInternalRoot(renderer, domContainer, options)
  }

  private initInternalRoot (renderer: Renderer, domContainer: TaroElement, options?: CreateRootOptions) {
    // Since react-reconciler v0.27, createContainer need more parameters
    // @see:https://github.com/facebook/react/blob/0b974418c9a56f6c560298560265dcf4b65784bc/packages/react-reconciler/src/ReactFiberReconciler.js#L248
    const containerInfo = domContainer
    if (options) {
      const tag = 1 // ConcurrentRoot
      const concurrentUpdatesByDefaultOverride = false
      let isStrictMode = false
      let identifierPrefix = ''
      let onRecoverableError = (error: any) => console.error(error)
      let transitionCallbacks = null
      if (options.unstable_strictMode === true) {
        isStrictMode = true
      }
      if (options.identifierPrefix !== undefined) {
        identifierPrefix = options.identifierPrefix
      }
      if (options.onRecoverableError !== undefined) {
        onRecoverableError = options.onRecoverableError
      }
      if (options.unstable_transitionCallbacks !== undefined) {
        transitionCallbacks = options.unstable_transitionCallbacks
      }

      this.internalRoot = renderer.createContainer(
        containerInfo,
        tag,
        null, // hydrationCallbacks
        isStrictMode,
        concurrentUpdatesByDefaultOverride,
        identifierPrefix,
        onRecoverableError,
        transitionCallbacks
      )
    } else {
      const tag = 0 // LegacyRoot
      this.internalRoot = renderer.createContainer(
        containerInfo,
        tag,
        null, // hydrationCallbacks
        false, // isStrictMode
        false, // concurrentUpdatesByDefaultOverride,
        '', // identifierPrefix
        () => {}, // onRecoverableError, this isn't reachable because onRecoverableError isn't called in the legacy API.
        null // transitionCallbacks
      )
    }
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

export function createRoot (domContainer: TaroElement, options: CreateRootOptions = {}) {
  const oldRoot = ContainerMap.get(domContainer)
  if (oldRoot != null) {
    return oldRoot
  }
  // options should be an object
  const root = new Root(TaroReconciler, domContainer, options)
  ContainerMap.set(domContainer, root)
  return root
}
