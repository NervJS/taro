import { processApis } from '@tarojs/shared'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { initNativeApi } from '../../taro-platform-weapp/src/apis'
import {
  bumpNearestCtxEpochForRoot,
  createComponentConfig,
  createRecursiveComponentConfig,
  Current,
  document,
  hooks,
  TaroRootElement
} from '../src/index'

const syncApis = ['createCanvasContext', 'createAudioContext', 'createVideoContext', 'createMapContext', 'createLivePlayerContext']
const canvasApis = ['canvasToTempFilePath', 'canvasPutImageData', 'canvasGetImageData']
const roots: TaroRootElement[] = []
const originalApp = Current.app

function makeTree () {
  const root = new TaroRootElement()
  const ctx = { setData: vi.fn((_data, cb) => cb?.()) } as any
  root.ctx = ctx
  const node = document.createElement('view')
  root.appendChild(node)
  roots.push(root)
  return { root, node, ctx }
}

function makeApis (useWeappInit = true, extraNative: Record<string, any> = {}) {
  const scheduled: (() => void)[] = []
  const native: Record<string, any> = {}
  const queryMethods: { in: ReturnType<typeof vi.fn>, exec: ReturnType<typeof vi.fn> }[] = []
  for (const name of syncApis) {
    native[name] = vi.fn(function () {
      expect(this).toBe(native)
      return { api: name }
    })
  }
  for (const name of canvasApis) {
    native[name] = vi.fn(function (options) {
      expect(this).toBe(native)
      const result = { errMsg: `${name}:ok` }
      options.success?.(result)
      options.complete?.(result)
      return { abort: vi.fn() }
    })
  }
  native.createSelectorQuery = vi.fn(function () {
    expect(this).toBe(native)
    const methods = {
      in: vi.fn(function (_scope) { return this }),
      exec: vi.fn(function () { return this })
    }
    queryMethods.push(methods)
    return {
      ...methods,
      select: vi.fn(function (_selector) { return this })
    }
  })
  native.createIntersectionObserver = vi.fn(function () {
    expect(this).toBe(native)
    return {
      relativeTo: vi.fn(function (_selector) { return this }),
      observe: vi.fn(function (_selector, _callback) { return this }),
      disconnect: vi.fn()
    }
  })
  const taro: Record<string, any> = {
    options: {},
    config: {},
    nextTick: vi.fn(callback => scheduled.push(callback)),
    Link: class {
      request () {}
      addInterceptor () {}
      cleanInterceptors () {}
    }
  }
  Object.assign(native, extraNative)
  vi.stubGlobal('wx', native)
  if (useWeappInit) initNativeApi(taro)
  else processApis(taro, native)
  return { taro, native, scheduled, queryMethods }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubEnv('TARO_ENV', 'weapp')
  vi.stubEnv('TARO_PLATFORM', 'mini')
  vi.stubGlobal('getCurrentPages', vi.fn())
  vi.stubGlobal('getApp', vi.fn())
})

afterEach(() => {
  roots.splice(0).forEach(root => root.remove())
  Current.app = originalApp
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('weapp native scope API adaptation', () => {
  test.each(syncApis)('%s resolves a real node and preserves native context return/receiver', api => {
    const { taro, native } = makeApis()
    const { node, ctx } = makeTree()
    const result = taro[api]('target', node)
    expect(native[api]).toHaveBeenCalledWith('target', ctx)
    expect(result).toBe(native[api].mock.results[0].value)
    expect(node._scope).toBe(ctx)
  })

  test.each(canvasApis)('%s resolves scope without mutating options or converting canvas resources', async api => {
    const { taro, native } = makeApis()
    const { node, ctx } = makeTree()
    const success = vi.fn()
    const complete = vi.fn()
    const resource = { _scope: 'resource', getContext: vi.fn() }
    const options = Object.freeze({ canvasId: 'target', canvas: resource, success, complete })
    const result = await taro[api](options, node)
    expect(native[api].mock.calls[0][1]).toBe(ctx)
    expect(native[api].mock.calls[0][0]).not.toBe(options)
    expect(native[api].mock.calls[0][0].canvas).toBe(resource)
    expect(options.success).toBe(success)
    expect(success).toHaveBeenCalledWith(result)
    expect(complete).toHaveBeenCalledWith(result)
  })

  test('final SelectorQuery.in resolves immediately and preserves chain and one nextTick', () => {
    const { taro, scheduled, queryMethods } = makeApis()
    const { node, ctx } = makeTree()
    const query = taro.createSelectorQuery()
    expect(query.in(node)).toBe(query)
    expect(queryMethods[0].in).toHaveBeenCalledWith(ctx)
    expect(queryMethods[0].in.mock.instances[0]).toBe(query)
    expect(query.select('#target')).toBe(query)
    const exec = vi.fn()
    query.exec(exec)
    expect(taro.nextTick).toHaveBeenCalledTimes(1)
    expect(scheduled).toHaveLength(1)
    expect(node._scope).toBe(ctx)
    expect(queryMethods[0].exec).not.toHaveBeenCalled()
    scheduled[0]()
    expect(queryMethods[0].exec).toHaveBeenCalledWith(exec)
  })

  test('final IO factory resolves scope and preserves relativeTo/observe scheduling', () => {
    const { taro, native, scheduled } = makeApis()
    const { node, ctx } = makeTree()
    const options = Object.freeze({ thresholds: [0], observeAll: true })
    const observer = taro.createIntersectionObserver(node, options)
    expect(native.createIntersectionObserver).toHaveBeenCalledWith(ctx, options)
    expect(observer.relativeTo('#container')).toBe(observer)
    observer.observe('#target', vi.fn())
    expect(taro.nextTick).toHaveBeenCalledTimes(1)
    expect(scheduled).toHaveLength(1)
    scheduled[0]()
  })

  test.each([...syncApis, ...canvasApis, 'createIntersectionObserver'])('%s keeps native instances and omitted/null/undefined arguments', async api => {
    const { taro, native } = makeApis()
    const nativeCtx = Object.defineProperty({}, '_scope', { get: () => { throw new Error('must not read native _scope') } })
    const first = canvasApis.includes(api) ? {} : 'target'
    for (const scope of [nativeCtx, null, undefined]) {
      if (api === 'createIntersectionObserver') taro[api](scope, {})
      else await taro[api](first, scope)
      const call = native[api].mock.calls.at(-1)
      expect(call[api === 'createIntersectionObserver' ? 0 : 1]).toBe(scope)
    }
    if (api === 'createIntersectionObserver') taro[api]()
    else await taro[api](first)
    expect(native[api].mock.calls.at(-1)).toHaveLength(api === 'createIntersectionObserver' ? 0 : 1)
  })

  test.each(syncApis)('%s rejects detached or ctx-less nodes before calling native', api => {
    const { taro, native } = makeApis()
    const { root, node } = makeTree()
    root.ctx = null
    bumpNearestCtxEpochForRoot(root)
    expect(() => taro[api]('target', node)).toThrow(/scope/i)
    node.remove()
    expect(() => taro[api]('target', node)).toThrow(/scope/i)
    expect(native[api]).not.toHaveBeenCalled()
  })

  test.each(canvasApis)('%s rejects invalid scope via fail/complete without native call', async api => {
    const { taro, native } = makeApis()
    const node = document.createElement('view')
    const fail = vi.fn()
    const complete = vi.fn()
    const success = vi.fn()
    const options = Object.freeze({ canvasId: 'target', fail, complete, success })
    await expect(taro[api](options, node)).rejects.toMatchObject({ errMsg: expect.stringMatching(/scope/i) })
    expect(native[api]).not.toHaveBeenCalled()
    expect(fail).toHaveBeenCalledOnce()
    expect(complete).toHaveBeenCalledWith(fail.mock.calls[0][0])
    expect(success).not.toHaveBeenCalled()
  })

  test('query and IO reject invalid scopes without widening to the page', () => {
    const { taro, native, scheduled } = makeApis()
    const node = document.createElement('view')
    const query = taro.createSelectorQuery()
    expect(() => query.in(node)).toThrow(/scope/i)
    expect(() => taro.createIntersectionObserver(node, {})).toThrow(/scope/i)
    expect(native.createIntersectionObserver).not.toHaveBeenCalled()
    expect(scheduled).toHaveLength(0)
  })

  test('fresh API calls follow self/nearest wrapper scopes and cross-root cache invalidation', () => {
    const { taro, native } = makeApis()
    const first = makeTree()
    const second = makeTree()
    // Match destination epoch after move to the cached source epoch.
    first.root.appendChild(document.createElement('view'))
    expect(first.node._scope).toBe(first.ctx)
    second.root.appendChild(first.node)
    taro.createMapContext('target', first.node)
    expect(native.createMapContext).toHaveBeenLastCalledWith('target', second.ctx)
    const wrapper = document.createElement('custom-wrapper')
    wrapper.appendChild(first.node)
    second.root.appendChild(wrapper)
    const config = createRecursiveComponentConfig('custom-wrapper')
    const [attached, detached] = hooks.call('getMiniLifecycleImpl')!.component
    const wrapperCtx = { setData: vi.fn(), data: { i: { sid: wrapper.sid } } }
    config[attached].call(wrapperCtx)
    taro.createVideoContext('target', first.node)
    expect(native.createVideoContext).toHaveBeenLastCalledWith('target', wrapperCtx)
    taro.createVideoContext('target', wrapper)
    expect(native.createVideoContext).toHaveBeenLastCalledWith('target', wrapperCtx)
    config[detached].call(wrapperCtx)
  })

  test('nested forced recursive components and IO selectors use the same nearest native scope', () => {
    const { taro, native, queryMethods } = makeApis()
    const { root, node } = makeTree()
    const outer = document.createElement('custom-wrapper')
    const inner = document.createElement('view')
    inner.appendChild(node)
    outer.appendChild(inner)
    root.appendChild(outer)
    const outerConfig = createRecursiveComponentConfig('custom-wrapper')
    const innerConfig = createRecursiveComponentConfig('comp', true)
    const [attached, detached] = hooks.call('getMiniLifecycleImpl')!.component
    const outerCtx = { setData: vi.fn(), data: { i: { sid: outer.sid } } }
    const innerCtx = { setData: vi.fn(), data: { i: { sid: inner.sid } } }
    outerConfig[attached].call(outerCtx)
    innerConfig[attached].call(innerCtx)
    taro.createSelectorQuery().in(node)
    expect(queryMethods[0].in).toHaveBeenCalledWith(innerCtx)
    const observer = taro.createIntersectionObserver(inner, {})
    observer.relativeTo('#relative').observe('#target', vi.fn())
    expect(native.createIntersectionObserver).toHaveBeenCalledWith(innerCtx, {})
    innerConfig[detached].call(innerCtx)
    taro.createMapContext('target', node)
    expect(native.createMapContext).toHaveBeenLastCalledWith('target', outerCtx)
    outerConfig[detached].call(outerCtx)
  })

  test('an unattached custom-wrapper cannot silently fall back to the page ctx', () => {
    const { taro, native } = makeApis()
    const { root, node } = makeTree()
    const wrapper = document.createElement('custom-wrapper')
    wrapper.appendChild(node)
    root.appendChild(wrapper)
    expect(node._scope).toBe(root.ctx)
    expect(() => taro.createVideoContext('target', node)).toThrow(/scope.*not ready/i)
    expect(() => taro.createSelectorQuery().in(wrapper)).toThrow(/scope.*not ready/i)
    expect(native.createVideoContext).not.toHaveBeenCalled()
  })

  test('query.in resolves native arguments once even when the native factory reuses a query', () => {
    const { taro, native, queryMethods } = makeApis()
    const { node } = makeTree()
    const query = taro.createSelectorQuery()
    native.createSelectorQuery.mockReturnValue(query)
    const nextQuery = taro.createSelectorQuery()
    const getScope = vi.spyOn(node, '_scope', 'get')
    nextQuery.in(node)
    expect(getScope).toHaveBeenCalledOnce()
    expect(queryMethods[0].in).toHaveBeenCalledOnce()
  })

  test('query.in preserves native instances, default arguments and the original method receiver', () => {
    const { taro, queryMethods } = makeApis()
    const query = taro.createSelectorQuery()
    const nativeCtx = Object.defineProperty({}, '_scope', { get: () => { throw new Error('must not read _scope') } })
    expect(query.in(nativeCtx)).toBe(query)
    expect(queryMethods[0].in.mock.calls[0][0] === nativeCtx).toBe(true)
    query.in()
    expect(queryMethods[0].in.mock.calls[1]).toHaveLength(0)
    const receiver = {}
    expect(query.in.call(receiver, null)).toBe(receiver)
    expect(queryMethods[0].in.mock.instances[2]).toBe(receiver)
  })

  test('Canvas native failures preserve fail/complete callbacks and Promise rejection', async () => {
    const failure = { errMsg: 'canvasGetImageData:fail native' }
    const fail = vi.fn()
    const complete = vi.fn()
    const nativeCanvas = vi.fn((options, _scope) => { options.fail(failure); options.complete(failure) })
    const { taro } = makeApis(true, { canvasGetImageData: nativeCanvas })
    const { node, ctx } = makeTree()
    await expect(taro.canvasGetImageData({ fail, complete }, node)).rejects.toBe(failure)
    expect(nativeCanvas.mock.calls[0][1] === ctx).toBe(true)
    expect(fail).toHaveBeenCalledWith(failure)
    expect(complete).toHaveBeenCalledWith(failure)
  })

  test('non-node refs and duck-typed objects are not interpreted as Taro nodes', () => {
    const { taro, native } = makeApis()
    const { node } = makeTree()
    const ref = { current: node }
    const duck = Object.defineProperty({ nodeType: 1, nodeName: 'view' }, '_scope', {
      get: () => { throw new Error('must not read duck-typed _scope') }
    })
    for (const scope of [ref, duck]) {
      taro.createMapContext('target', scope)
      expect(native.createMapContext.mock.calls.at(-1)[1] === scope).toBe(true)
    }
  })

  test('excluded API/resources and Promise task extensions retain their original behavior', async () => {
    const { node } = makeTree()
    const getScope = vi.spyOn(node, '_scope', 'get')
    const logIn = vi.fn(function (_page) { return this })
    const mediaQuery = vi.fn(scope => scope)
    const offscreen = vi.fn(options => options)
    const onProgressUpdate = vi.fn()
    const task = { abort: vi.fn(), onProgressUpdate }
    const uploadFile = vi.fn(options => { options.success({ errMsg: 'uploadFile:ok' }); return task })
    const extra = {
      createOffscreenCanvas: offscreen,
      createMediaQueryObserver: mediaQuery,
      getRealtimeLogManager: vi.fn(() => ({ in: logIn })),
      uploadFile
    }
    const { taro } = makeApis(true, extra)
    const options = { compInst: node }
    expect(taro.createOffscreenCanvas(options) === options).toBe(true)
    expect(taro.createMediaQueryObserver(node) === node).toBe(true)
    const log = taro.getRealtimeLogManager()
    expect(log.in === logIn).toBe(true)
    log.in(node)
    const promise = taro.uploadFile({})
    const progress = vi.fn()
    expect(promise.progress(progress)).toBe(promise)
    expect(onProgressUpdate).toHaveBeenCalledWith(progress)
    promise.abort()
    expect(task.abort).toHaveBeenCalledOnce()
    await promise
    expect(getScope).not.toHaveBeenCalled()
  })

  test('standalone attach/detach fixes invalidate adapter scope resolution', () => {
    const { taro, native } = makeApis()
    const { root, node, ctx } = makeTree()
    root.ctx = null
    bumpNearestCtxEpochForRoot(root)
    expect(node._scope).toBeNull()
    vi.spyOn(root, 'performUpdate').mockImplementation(() => {})
    Current.app = {
      mount: (_component, path, callback) => { root.id = path; callback() },
      unmount: (_path, callback) => callback()
    } as any
    const config = createComponentConfig(class {} as any)
    const [attached, detached] = hooks.call('getMiniLifecycleImpl')!.component
    config[attached].call(ctx)
    taro.createCanvasContext('target', node)
    expect(native.createCanvasContext).toHaveBeenLastCalledWith('target', ctx)
    config[detached].call(ctx)
    expect(() => taro.createCanvasContext('target', node)).toThrow(/scope/i)
  })
})

test.each(['jd', 'h5', 'tt', 'qq', 'swan', 'alipay', 'rn', 'harmony', 'harmony_hybrid', 'harmony_cpp'])('scope arguments stay untouched and do not read _scope in %s', async env => {
  vi.stubEnv('TARO_ENV', env)
  const { taro, native, queryMethods } = makeApis(false)
  const { node } = makeTree()
  const getScope = vi.spyOn(node, '_scope', 'get').mockImplementation(() => { throw new Error('must not read _scope') })
  for (const api of syncApis) {
    taro[api]('target', node)
    expect(native[api].mock.calls[0][0]).toBe('target')
    expect(native[api].mock.calls[0][1] === node).toBe(true)
  }
  for (const api of canvasApis) {
    await taro[api]({}, node)
    expect(native[api].mock.calls[0][1] === node).toBe(true)
  }
  const query = taro.createSelectorQuery()
  query.in(node)
  expect(query.in === queryMethods[0].in).toBe(true)
  expect(queryMethods[0].in.mock.calls[0][0] === node).toBe(true)
  taro.createIntersectionObserver(node, {})
  expect(native.createIntersectionObserver.mock.calls[0][0] === node).toBe(true)
  expect(getScope).not.toHaveBeenCalled()
})
