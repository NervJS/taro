/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, ContainerMap } from './render'
import { TaroReconciler } from './reconciler'
import { TaroElement } from '@tarojs/runtime'
import { ReactNode } from 'react'
import { ensure } from '@tarojs/shared'

const unstable_batchedUpdates = TaroReconciler.batchedUpdates

function unmountComponentAtNode (dom: TaroElement) {
  ensure(dom && [1, 8, 9, 11].includes(dom.nodeType), 'unmountComponentAtNode(...): Target container is not a DOM element.')

  const root = ContainerMap.get(dom)

  if (!root) return false

  unstable_batchedUpdates(() => {
    root.unmount(() => {
      ContainerMap.delete(dom)
    })
  })

  return true
}

function findDOMNode (comp?: TaroElement | ReactNode) {
  if (comp == null) {
    return null
  }

  const nodeType = (comp as TaroElement).nodeType
  if (nodeType === 1 || nodeType === 3) {
    return comp
  }

  return TaroReconciler.findHostInstance(comp as object)
}

const portalType = typeof Symbol === 'function' && Symbol.for
  ? Symbol.for('react.portal')
  : 0xeaca

function createPortal (
  children: ReactNode,
  containerInfo: TaroElement,
  key?: string
) {
  return {
    $$typeof: portalType,
    key: key == null ? null : String(key),
    children,
    containerInfo,
    implementation: null
  }
}

export {
  render,
  unstable_batchedUpdates,
  unmountComponentAtNode,
  findDOMNode,
  createPortal
}

export default {
  render,
  unstable_batchedUpdates,
  unmountComponentAtNode,
  findDOMNode,
  createPortal
}
