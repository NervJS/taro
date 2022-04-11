/* eslint-disable @typescript-eslint/indent */
import Reconciler, { HostConfig } from 'react-reconciler'
import * as scheduler from 'scheduler'
import { TaroElement, TaroText, document } from '@tarojs/runtime'
import { noop, EMPTY_ARR, isUndefined, isBoolean } from '@tarojs/shared'
import { Props, updateProps } from './props'

const {
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
  TaroElement, // SuspenseInstance
  TaroElement, // HydratableInstance
  TaroElement, // PublicInstance
  Record<string, any>, // HostContext
  string[], // UpdatePayload
  unknown, // ChildSet
  unknown, // TimeoutHandle
  unknown // NoTimeout
> & {
  hideInstance (instance: TaroElement): void
  unhideInstance (instance: TaroElement, props): void
  getCurrentEventPriority(): number
  detachDeletedInstance(): void
} = {
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

  getCurrentEventPriority () {
    // 因 @types/react-reconciler 未更新，ts会报错，这里直接返回16
    return 16 // import { DefaultEventPriority } from 'react-reconciler/constants'
  },

  detachDeletedInstance () {
    // noop
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

  hideInstance (instance) {
    const style = instance.style
    style.setProperty('display', 'none')
  },

  unhideInstance (instance, props) {
    const styleProp = props.style
    let display = styleProp?.hasOwnProperty('display') ? styleProp.display : null
    display = display == null || isBoolean(display) || display === '' ? '' : ('' + display).trim()
    // eslint-disable-next-line dot-notation
    instance.style['display'] = display
  },

  clearContainer (element) {
    if (element.childNodes.length > 0) {
      element.textContent = ''
    }
  },

  queueMicrotask: !isUndefined(Promise)
  ? callback =>
      Promise.resolve(null)
        .then(callback)
        .catch(function (error) {
          setTimeout(() => {
            throw error
          })
        })
  : setTimeout,

  shouldSetTextContent: returnFalse,
  prepareForCommit (..._: any[]) { return null },
  resetAfterCommit: noop,
  commitMount: noop,
  now,
  cancelTimeout: clearTimeout,
  scheduleTimeout: setTimeout,
  preparePortalMount: noop,
  noTimeout: -1,
  supportsMutation: true,
  supportsPersistence: false,
  isPrimaryRenderer: true,
  supportsHydration: false
}

const TaroReconciler = Reconciler(hostConfig)

if (process.env.NODE_ENV !== 'production') {
  const foundDevTools = TaroReconciler.injectIntoDevTools({
    bundleType: 1,
    version: '18.0.0',
    rendererPackageName: 'taro-react'
  })
  if (!foundDevTools) {
    // eslint-disable-next-line no-console
    console.info('%cDownload the React DevTools ' + 'for a better development experience: ' + 'https://reactjs.org/link/react-devtools', 'font-weight:bold')
  }
}

export {
  TaroReconciler
}
