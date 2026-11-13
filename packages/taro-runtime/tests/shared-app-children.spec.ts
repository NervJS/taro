import React from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { createReactApp } from '../../taro-framework-react/src/runtime/connect'
import { createNativeComponentConfig } from '../../taro-framework-react/src/runtime/connect-native'
import { Current, document, hooks, TaroElement } from '../src'

// Only rendering is substituted: the test inserts real Taro nodes after each entry initializes.
const renderer = { render () {}, createRoot () { return { render () {} } } }
const App = () => null

function businessGetRoot (from?: any) {
  const elements = Array.from(document.getElementById('app')?.children || [])
    .filter(item => item.nodeName === 'root')
  let root: TaroElement | undefined
  if (from) {
    let parent = ('parentElement' in from) && from.parentElement
    while (parent && !root) {
      root = elements.find(element => element === parent)
      parent = parent.parentElement
    }
    root ||= elements.find(element => (element.ctx || element.__page)?.$taroPath === from.$taroPath)
  }
  root ||= elements[elements.length - 1]
  if (!root) return undefined
  let wrapper = root.children.find(node => node.getAttribute('root') === 'root')
  if (!wrapper) {
    wrapper = document.createElement('custom-wrapper')
    wrapper.setAttribute('root', 'root')
    root.appendChild(wrapper)
  }
  return wrapper
}

describe('shared React app children compatibility', () => {
  let app: TaroElement
  let previousApp: TaroElement
  const containers: TaroElement[] = []

  beforeEach(() => {
    vi.useFakeTimers()
    previousApp = document.getElementById('app')!
    app = document.createElement('app')
    app.id = 'app'
    previousApp.parentNode!.appendChild(app)
    hooks.tap('getMiniLifecycleImpl', () => ({ app: ['onLaunch', 'onShow', 'onHide'] }))
  })

  afterEach(() => {
    Current.page = null
    Current.router = null
    Current.app = null
    for (const container of containers) {
      while (container.firstChild) container.removeChild(container.firstChild)
      container.parentNode?.removeChild(container)
    }
    containers.length = 0
    app.parentNode?.removeChild(app)
    previousApp.id = 'app'
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  function initPage (pkgId: string, shared = true) {
    createReactApp(App as any, React, renderer, {
      appId: pkgId,
      ...(shared ? { __taroSharedRuntimePkgId: pkgId } : {})
    } as any)
    const container = document.getElementById(pkgId)!
    containers.push(container)
    return container
  }

  function initNative (pkgId: string, shared = true) {
    const option = createNativeComponentConfig(App, React, renderer, {
      isNewBlended: true,
      ...(shared ? { isNativeShared: true, pkgId, globalKey: '__testSharedRuntime' } : {})
    })
    option.created.call({})
    const container = shared ? document.getElementById(`app_${pkgId}`)! : app.parentNode!.lastChild as TaroElement
    containers.push(container)
    return container
  }

  function mountRoot (container: TaroElement, id: string) {
    const root = document.createElement('root')
    root.id = id
    container.appendChild(root)
    return root
  }

  test('Native entry exposes page root through physical #app without replacing its childNodes', () => {
    const appChildren = app.childNodes
    const container = initNative('nativePkg')
    const containerChildren = container.childNodes
    const root = mountRoot(container, 'native-page')

    expect(businessGetRoot()?.parentNode).toBe(root)
    expect(document.getElementById('app')).toBe(app)
    expect(document.querySelector('#app')).toBe(app)
    expect(document.getElementById('app_nativePkg')).toBe(container)
    expect(app.childNodes).toBe(appChildren)
    expect(app.childNodes).toEqual([container])
    expect(container.childNodes).toBe(containerChildren)
    expect(container.parentNode).toBe(app)
    expect(root.parentNode).toBe(container)
  })

  test('ordinary shared Page root is visible without moving its rendering container', () => {
    const container = initPage('pagePkg')
    const parent = container.parentNode
    const appChildren = app.childNodes
    const root = mountRoot(container, 'ordinary-page')

    expect(businessGetRoot()?.parentNode).toBe(root)
    expect(container.parentNode).toBe(parent)
    expect(root.parentNode).toBe(container)
    expect(app.childNodes).toBe(appChildren)
    expect(app.childNodes).not.toContain(root)
  })

  test('A to B to A page switching selects current page rather than last initialized package', () => {
    const nativeRoot = mountRoot(initNative('switchNative'), 'native-current')
    const pageRoot = mountRoot(initPage('switchPage'), 'ordinary-current')
    nativeRoot.ctx = { $taroPath: 'native-current' }
    pageRoot.ctx = { $taroPath: 'ordinary-current' }

    for (const root of [nativeRoot, pageRoot, nativeRoot]) {
      Current.page = root.ctx
      expect(businessGetRoot()?.parentNode).toBe(root)
    }
  })

  test('current page ctx takes precedence over Native child component router id', () => {
    const container = initNative('ctxPriority')
    const childRoot = mountRoot(container, 'child-component')
    const pageRoot = mountRoot(container, 'parent-page')
    const otherRoot = mountRoot(initPage('backgroundPkg'), 'background-page')
    pageRoot.ctx = { $taroPath: 'parent-page' }
    Current.page = pageRoot.ctx
    Current.router = { $taroPath: childRoot.id } as any

    expect(businessGetRoot()?.parentNode).toBe(pageRoot)
    expect(businessGetRoot()?.parentNode).not.toBe(otherRoot)
  })

  test('router path selects page when page ctx is not yet mounted', () => {
    const root = mountRoot(initNative('routerPkg'), 'router-page')
    mountRoot(initPage('laterPkg'), 'later-page')
    Current.page = { $taroPath: 'router-page' } as any
    Current.router = { $taroPath: 'router-page' } as any
    expect(businessGetRoot()?.parentNode).toBe(root)
  })

  test('explicit from element and page instance still find background roots', () => {
    const first = mountRoot(initNative('fromNative'), 'first-page')
    const second = mountRoot(initPage('fromPage'), 'second-page')
    first.ctx = { $taroPath: 'first-page' }
    Current.page = { $taroPath: 'second-page' } as any
    Current.router = { $taroPath: 'second-page' } as any
    const view = document.createElement('view')
    first.appendChild(view)

    expect(businessGetRoot(view)?.parentNode).toBe(first)
    expect(businessGetRoot(first.ctx)?.parentNode).toBe(first)
    expect(businessGetRoot()?.parentNode).toBe(second)
  })

  test('removing a root updates the query view without lifecycle bookkeeping', () => {
    const firstContainer = initNative('unloadNative')
    const first = mountRoot(firstContainer, 'first-unload-page')
    const secondContainer = initPage('unloadPage')
    const second = mountRoot(secondContainer, 'second-unload-page')
    const children = app.childNodes

    expect(businessGetRoot()?.parentNode).toBe(second)
    secondContainer.removeChild(second)
    expect(businessGetRoot()?.parentNode).toBe(first)
    firstContainer.removeChild(first)
    expect(businessGetRoot()).toBeUndefined()
    expect(app.childNodes).toBe(children)
  })

  test.each(['page', 'native'])('non-shared %s entry keeps ordinary children lookup', kind => {
    const container = kind === 'page' ? initPage('customAppId', false) : initNative('vanilla', false)
    const root = mountRoot(container, 'not-shared')
    expect(Object.prototype.hasOwnProperty.call(app, 'children')).toBe(false)
    expect(app.children).not.toContain(root)
    expect(container.children).toContain(root)
  })

  test('unmarked descendants are not flattened by shared compatibility', () => {
    const container = initNative('markedPkg')
    const root = mountRoot(container, 'marked-root')
    const unmarked = document.createElement('view')
    const nested = document.createElement('root')
    unmarked.appendChild(nested)
    app.appendChild(unmarked)
    app.appendChild(document.createTextNode('text'))

    expect(app.children).toContain(unmarked)
    expect(app.children).not.toContain(nested)
    expect(businessGetRoot()?.parentNode).toBe(root)
    expect(app.childNodes).toHaveLength(3)
  })
})
