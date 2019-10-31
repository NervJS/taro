/* eslint-disable @typescript-eslint/indent */
import Reconciler, { HostConfig } from 'react-reconciler'
import * as scheduler from 'scheduler'
import { TaroElement, TaroText, document } from '@tarojs/runtime'
import { noop, EMPTY_ARR } from '@tarojs/shared'
import { Props, updateProps } from './props'

const {
  unstable_scheduleCallback: scheduleDeferredCallback,
  unstable_cancelCallback: cancelDeferredCallback,
  unstable_now: now
} = scheduler

function returnFalse () {
  return false
}

const hostConfig: HostConfig<
  string, // Type
  Props, // Props
  TaroElement, // Container
  TaroElement, // Instance
  TaroText, // TextInstance
  TaroElement, // HydratableInstance
  TaroElement, // PublicInstance
  object, // HostContext
  string[], // UpdatePayload
  unknown, // ChildSet
  unknown, // TimeoutHandle
  unknown // NoTimeout
> = {
  createInstance (type) {
    return document.createElement(type)
  },

  createTextInstance (text) {
    return document.createTextNode(text)
  },

  getPublicInstance (inst: TaroElement) {
    return inst
  },

  getRootHostContext () {
    return {}
  },

  getChildHostContext () {
    return {}
  },

  appendChild (parent, child) {
    parent.appendChild(child)
  },

  appendInitialChild (parent, child) {
    parent.appendChild(child)
  },

  appendChildToContainer (parent, child) {
    parent.appendChild(child)
  },

  removeChild (parent, child) {
    parent.removeChild(child)
  },

  removeChildFromContainer (parent, child) {
    parent.removeChild(child)
  },

  insertBefore (parent, child, refChild) {
    parent.insertBefore(child, refChild)
  },

  insertInContainerBefore (parent, child, refChild) {
    parent.insertBefore(child, refChild)
  },

  commitTextUpdate (textInst, _, newText) {
    textInst.nodeValue = newText
  },

  finalizeInitialChildren (dom, _, props) {
    updateProps(dom, {}, props)
    return false
  },

  prepareUpdate () {
    return EMPTY_ARR
  },

  commitUpdate (dom, _payload, _type, oldProps, newProps) {
    updateProps(dom, oldProps, newProps)
  },

  shouldSetTextContent: returnFalse,
  shouldDeprioritizeSubtree: returnFalse,
  prepareForCommit: noop,
  resetAfterCommit: noop,
  commitMount: noop,
  now,
  scheduleDeferredCallback,
  cancelDeferredCallback,
  clearTimeout: clearTimeout,
  setTimeout: setTimeout,
  noTimeout: -1,
  supportsMutation: true,
  supportsPersistence: false,
  isPrimaryRenderer: true,
  supportsHydration: false
}

export const TaroReconciler = Reconciler(hostConfig)
