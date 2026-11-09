import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import {
  bumpNearestCtxEpochForRoot,
  createComponentConfig,
  createRecursiveComponentConfig,
  Current,
  document,
  getNearestCtx,
  hooks,
  TaroRootElement
} from '../src/index'

import type { MpInstance } from '../src/interface'

const roots: TaroRootElement[] = []
const originalApp = Current.app

function createCtx () {
  return { setData: vi.fn((_data, callback) => callback?.()) } as unknown as MpInstance
}

function createRoot (ctx: MpInstance | null = null) {
  const root = new TaroRootElement()
  root.ctx = ctx
  roots.push(root)
  return root
}

function createStandaloneComponent () {
  const root = createRoot()
  const child = document.createElement('view')
  const text = document.createTextNode('text')
  child.appendChild(text)
  root.appendChild(child)
  document.body.appendChild(root)
  const ctx = createCtx()
  const config = createComponentConfig(class {} as any)
  const [attached, detached] = hooks.call('getMiniLifecycleImpl')!.component
  const scopesAtUpdate: unknown[] = []
  const performUpdate = vi.spyOn(root, 'performUpdate').mockImplementation(() => {
    scopesAtUpdate.push(child._scope)
  })
  const mount = vi.fn((_component, path, callback) => {
    root.id = path
    // A ref can be read during rendering, before the native ctx is bound.
    expect(root._scope).toBeNull()
    expect(child._scope).toBeNull()
    expect(text._scope).toBeNull()
    callback()
  })
  const unmount = vi.fn((_path, callback) => callback())
  Current.app = { mount, unmount } as any
  return {
    root,
    child,
    text,
    ctx,
    performUpdate,
    scopesAtUpdate,
    mount,
    unmount,
    attach: (instance = ctx) => config[attached].call(instance),
    detach: () => config[detached].call(ctx)
  }
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  roots.splice(0).forEach(root => root.remove())
  Current.app = originalApp
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe.each(['weapp', 'jd'])('nearest ctx cache in %s', env => {
  beforeEach(() => {
    vi.stubEnv('TARO_ENV', env)
    vi.stubEnv('TARO_PLATFORM', 'mini')
  })

  test('uses stable opaque root tokens without caching a reference to the root', () => {
    const first = createRoot(createCtx())
    const second = createRoot(createCtx())
    const child = document.createElement('view')
    first.appendChild(child)
    const writes = vi.spyOn(WeakMap.prototype, 'set')
    const cacheEntry = () => writes.mock.calls.filter(([key]) => key === child).slice(-1)[0][1]

    expect(child._scope).toBe(first.ctx)
    const initial = cacheEntry()
    expect(initial).not.toHaveProperty('root')
    expect(initial.rootToken).toBeDefined()
    expect(initial.rootToken).not.toBe(first)
    expect(Object.keys(initial.rootToken)).toEqual([])
    expect(writes.mock.calls.find(([key]) => key === first)?.[1]).toBe(initial.rootToken)

    bumpNearestCtxEpochForRoot(first)
    expect(child._scope).toBe(first.ctx)
    expect(cacheEntry().rootToken).toBe(initial.rootToken)
    const cachedEpoch = first.nearestCtxEpoch
    bumpNearestCtxEpochForRoot(second)
    second.appendChild(child)
    expect(second.nearestCtxEpoch).toBe(cachedEpoch)
    expect(child._scope).toBe(second.ctx)
    expect(cacheEntry().rootToken).not.toBe(initial.rootToken)
    expect(Object.keys(cacheEntry().rootToken)).toEqual([])
  })

  test('does not reuse a cached ctx when moving to a different root with the same epoch', () => {
    const firstCtx = createCtx()
    const secondCtx = createCtx()
    const first = createRoot(firstCtx)
    const second = createRoot(secondCtx)
    const child = document.createElement('view')
    bumpNearestCtxEpochForRoot(first)
    bumpNearestCtxEpochForRoot(second)
    first.appendChild(child)
    const cachedEpoch = first.nearestCtxEpoch
    expect(child._scope).toBe(firstCtx)

    second.appendChild(child)

    expect(child._root).toBe(second)
    expect(second.nearestCtxEpoch).toBe(cachedEpoch)
    expect(first.nearestCtxEpoch).toBe(cachedEpoch + 1)
    expect(child._scope).toBe(secondCtx)
    expect(getNearestCtx(child)).toBe(secondCtx)
  })

  test('invalidates cached descendants when a subtree moves between roots', () => {
    const firstCtx = createCtx()
    const secondCtx = createCtx()
    const first = createRoot(firstCtx)
    const second = createRoot(secondCtx)
    const subtree = document.createElement('view')
    const child = document.createElement('view')
    const text = document.createTextNode('text')
    child.appendChild(text)
    subtree.appendChild(child)
    first.appendChild(subtree)
    const cachedEpoch = first.nearestCtxEpoch
    expect(subtree._scope).toBe(firstCtx)
    expect(child._scope).toBe(firstCtx)
    expect(text._scope).toBe(firstCtx)

    second.insertBefore(subtree)

    expect(second.nearestCtxEpoch).toBe(cachedEpoch)
    expect(subtree._scope).toBe(secondCtx)
    expect(child._scope).toBe(secondCtx)
    expect(text._scope).toBe(secondCtx)
  })

  test('does not reuse cached null in a different root with the same epoch', () => {
    const first = createRoot()
    const ctx = createCtx()
    const second = createRoot(ctx)
    const child = document.createElement('view')
    first.appendChild(child)
    const cachedEpoch = first.nearestCtxEpoch
    expect(child._scope).toBeNull()

    second.appendChild(child)

    expect(second.nearestCtxEpoch).toBe(cachedEpoch)
    expect(child._scope).toBe(ctx)
  })

  test('returns null while detached and resolves the ctx after reattachment', () => {
    const firstCtx = createCtx()
    const secondCtx = createCtx()
    const first = createRoot(firstCtx)
    const second = createRoot(secondCtx)
    const child = document.createElement('view')
    first.appendChild(child)
    expect(child._scope).toBe(firstCtx)

    first.removeChild(child)
    expect(child._scope).toBeNull()
    second.appendChild(child)
    expect(child._scope).toBe(secondCtx)
  })

  test('still invalidates the cache when reparenting within the same root', () => {
    const root = createRoot(createCtx())
    const first = document.createElement('view')
    const second = document.createElement('view')
    const child = document.createElement('view')
    first.ctx = createCtx()
    second.ctx = createCtx()
    first.appendChild(child)
    root.appendChild(first)
    root.appendChild(second)
    const cachedEpoch = root.nearestCtxEpoch
    expect(child._scope).toBe(first.ctx)

    second.appendChild(child)

    expect(root.nearestCtxEpoch).toBeGreaterThan(cachedEpoch)
    expect(child._scope).toBe(second.ctx)
  })

  test('prefers the node itself, then its closest ancestor, then the root ctx', () => {
    const rootCtx = createCtx()
    const root = createRoot(rootCtx)
    const wrapper = document.createElement('view')
    const child = document.createElement('view')
    const text = document.createTextNode('text')
    child.appendChild(text)
    wrapper.appendChild(child)
    root.appendChild(wrapper)
    expect(child._scope).toBe(rootCtx)

    wrapper.ctx = createCtx()
    bumpNearestCtxEpochForRoot(root)
    expect(child._scope).toBe(wrapper.ctx)
    child.ctx = createCtx()
    bumpNearestCtxEpochForRoot(root)
    expect(child._scope).toBe(child.ctx)
    expect(text._scope).toBe(child.ctx)
  })

  test('invalidates cached null as soon as a standalone component binds its ctx', () => {
    const component = createStandaloneComponent()
    const epoch = component.root.nearestCtxEpoch

    component.attach()

    expect(component.mount).toHaveBeenCalledOnce()
    expect(component.root.nearestCtxEpoch).toBe(epoch + 1)
    expect(component.root._scope).toBe(component.ctx)
    expect(component.child._scope).toBe(component.ctx)
    expect(component.text._scope).toBe(component.ctx)
    expect(component.performUpdate).toHaveBeenCalledWith(true)
    expect(component.scopesAtUpdate).toEqual([component.ctx])
  })

  test('invalidates cached ctx when a standalone component detaches without a DOM mutation', () => {
    const component = createStandaloneComponent()
    component.attach()
    // Prime with a fresh epoch so this regression isolates detach from attach.
    bumpNearestCtxEpochForRoot(component.root)
    expect(component.root._scope).toBe(component.ctx)
    expect(component.child._scope).toBe(component.ctx)
    expect(component.text._scope).toBe(component.ctx)
    const epoch = component.root.nearestCtxEpoch

    component.detach()

    expect(component.unmount).toHaveBeenCalledOnce()
    expect(component.root.ctx).toBeNull()
    expect(component.root.nearestCtxEpoch).toBe(epoch + 1)
    expect(component.child.parentNode).toBe(component.root)
    expect(component.root._scope).toBeNull()
    expect(component.child._scope).toBeNull()
    expect(component.text._scope).toBeNull()
  })

  test('resolves a new ctx when a standalone component attaches again', () => {
    const component = createStandaloneComponent()
    component.attach()
    component.detach()
    const nextCtx = createCtx()
    component.attach(nextCtx)

    expect(component.mount).toHaveBeenCalledTimes(2)
    expect(component.root._scope).toBe(nextCtx)
    expect(component.child._scope).toBe(nextCtx)
    expect(component.text._scope).toBe(nextCtx)
    expect(component.scopesAtUpdate).toEqual([component.ctx, nextCtx])
  })

  test('preserves recursive component attach/detach invalidation and root fallback', () => {
    const rootCtx = createCtx()
    const root = createRoot(rootCtx)
    const wrapper = document.createElement('custom-wrapper')
    const child = document.createElement('view')
    wrapper.appendChild(child)
    root.appendChild(wrapper)
    const config = createRecursiveComponentConfig('custom-wrapper')
    const [attached, detached] = hooks.call('getMiniLifecycleImpl')!.component
    const ctx = { ...createCtx(), data: { i: { sid: wrapper.sid } } }
    expect(child._scope).toBe(rootCtx)

    config[attached].call(ctx)
    expect(wrapper._scope).toBe(ctx)
    expect(child._scope).toBe(ctx)
    config[detached].call(ctx)
    expect(wrapper._scope).toBe(rootCtx)
    expect(child._scope).toBe(rootCtx)
  })
})

test.each(['h5', 'tt', 'alipay', 'qq', 'swan', 'rn', 'harmony'])('does not resolve or invalidate nearest ctx in %s', env => {
  vi.stubEnv('TARO_ENV', env)
  const root = createRoot(createCtx())
  const child = document.createElement('view')
  root.appendChild(child)
  const epoch = root.nearestCtxEpoch
  const getRoot = vi.spyOn(child, '_root', 'get')

  expect(child._scope).toBeUndefined()
  expect(getNearestCtx(child)).toBeUndefined()
  expect(getRoot).not.toHaveBeenCalled()
  bumpNearestCtxEpochForRoot(root)
  expect(root.nearestCtxEpoch).toBe(epoch)
})
