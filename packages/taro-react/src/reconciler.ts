/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { document, TaroElement, TaroText } from '@tarojs/runtime'
import { isBoolean, isUndefined, noop } from '@tarojs/shared'
import Reconciler, { HostConfig } from 'react-reconciler'
import { DefaultEventPriority } from 'react-reconciler/constants'

import { getUpdatePayload, Props, updateProps, updatePropsByPayload } from './props'

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
  supportsMicrotasks: boolean  // 待官方类型文件修复后删除
} = {
  // below keys order by {React ReactFiberHostConfig.custom.js}, convenient for comparing each other.

  // -------------------
  // required by @types/react-reconciler
  // -------------------
  getPublicInstance (inst: TaroElement) {
    return inst
  },
  getRootHostContext () {
    return {}
  },
  getChildHostContext (parentHostContext) {
    return parentHostContext
  },
  prepareForCommit (..._: any[]) {
    return null
  },
  resetAfterCommit: noop,
  createInstance (type) {
    return document.createElement(type)
  },
  appendInitialChild (parent, child) {
    parent.appendChild(child)
  },
  finalizeInitialChildren (dom, _, props: any) {
    updateProps(dom, {}, props)  // 提前执行更新属性操作，Taro 在 Page 初始化后会立即从 dom 读取必要信息
    return false
  },
  prepareUpdate (instance, _, oldProps, newProps) {
    return getUpdatePayload(instance, oldProps, newProps)
  },
  shouldSetTextContent () {
    return false
  },
  createTextInstance (text) {
    return document.createTextNode(text)
  },
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  isPrimaryRenderer: true,
  warnsIfNotActing: true,
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  getInstanceFromNode: () => null,
  beforeActiveInstanceBlur: noop,
  afterActiveInstanceBlur: noop,
  preparePortalMount: noop,
  prepareScopeUpdate: noop,
  getInstanceFromScope: () => null,
  getCurrentEventPriority () {
    return DefaultEventPriority
  },
  detachDeletedInstance: noop,

  // -------------------
  //      Microtasks
  //     (optional)
  // -------------------
  supportsMicrotasks: true,
  scheduleMicrotask: isUndefined(Promise)
    ? setTimeout
    : (callback) =>
      Promise.resolve(null)
        .then(callback)
        .catch(function (error) {
          setTimeout(() => {
            throw error
          })
        }),

  // -------------------
  //      Mutation
  //     (required if supportsMutation is true)
  // -------------------
  appendChild (parent, child) {
    parent.appendChild(child)
  },
  appendChildToContainer (parent, child) {
    parent.appendChild(child)
  },
  commitTextUpdate (textInst, _, newText) {
    textInst.nodeValue = newText
  },
  commitMount: noop,
  commitUpdate (dom, updatePayload, _, oldProps) {
    updatePropsByPayload(dom, oldProps, updatePayload)
  },
  insertBefore (parent, child, refChild) {
    parent.insertBefore(child, refChild)
  },
  insertInContainerBefore (parent, child, refChild) {
    parent.insertBefore(child, refChild)
  },
  removeChild (parent, child) {
    parent.removeChild(child)
  },
  removeChildFromContainer (parent, child) {
    parent.removeChild(child)
  },
  resetTextContent: noop,
  hideInstance (instance) {
    const style = instance.style
    style.setProperty('display', 'none')
  },
  hideTextInstance (textInstance) {
    textInstance.nodeValue = ''
  },
  unhideInstance (instance, props) {
    const styleProp = props.style as {display?: any}
    let display = styleProp?.hasOwnProperty('display') ? styleProp.display : null
    display = display == null || isBoolean(display) || display === '' ? '' : ('' + display).trim()
    // eslint-disable-next-line dot-notation
    instance.style['display'] = display
  },
  unhideTextInstance (textInstance, text) {
    textInstance.nodeValue = text
  },
  clearContainer (element) {
    if (element.childNodes.length > 0) {
      element.textContent = ''
    }
  },
}

const TaroReconciler = Reconciler(hostConfig)

if (process.env.NODE_ENV !== 'production') {
  const foundDevTools = TaroReconciler.injectIntoDevTools({
    bundleType: 1,
    version: '18.0.0',
    rendererPackageName: 'taro-react',
  })
  if (!foundDevTools) {
    // eslint-disable-next-line no-console
    console.info(
      '%cDownload the React DevTools ' +
        'for a better development experience: ' +
        'https://reactjs.org/link/react-devtools',
      'font-weight:bold'
    )
  }
}

export { TaroReconciler }
