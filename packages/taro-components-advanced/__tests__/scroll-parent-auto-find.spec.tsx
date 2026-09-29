import React, { act, useRef } from 'react'
import { createRoot } from 'react-dom/client'

import { useListNestedScroll } from '../src/components/list/hooks/useListNestedScroll'
import { useScrollParentAutoFind } from '../src/components/list/hooks/useScrollParentAutoFind'
import { ScrollElementContextOrFallback } from '../src/utils/scrollElementContext'
import * as scrollParent from '../src/utils/scrollParent'

import type { PropsWithChildren, RefObject } from 'react'
import type { Root } from 'react-dom/client'

jest.mock('@tarojs/runtime', () => ({ document: { getElementById: jest.fn() } }))
jest.mock('../src/components/list/utils', () => ({ isWeapp: false, isH5: true }))
jest.mock('../src/components/list/hooks/useMeasureStartOffset', () => ({ useMeasureStartOffset: () => 0 }))
jest.mock('../src/components/list/hooks/useMeasureStartOffsetWeapp', () => ({ useMeasureStartOffsetWeapp: () => 0 }))
jest.mock('../src/utils/scrollElementContext', () => ({
  ScrollElementContextOrFallback: jest.requireActual('react').createContext(null)
}))

const platform = jest.requireMock('../src/components/list/utils') as { isWeapp: boolean, isH5: boolean }

interface ProbeOptions {
  enabled?: boolean
  horizontal?: boolean
  omitRef?: boolean
  overflow?: boolean
  nestedList?: boolean
  strict?: boolean
  explicitRef?: RefObject<HTMLElement | null>
  contextRef?: RefObject<HTMLElement | null>
}

let observers: Observer[]

class Observer {
  callback: () => void
  observe = jest.fn()
  disconnect = jest.fn()

  constructor(callback: () => void) {
    this.callback = callback
    observers.push(this)
  }
}

let frames: Map<number, FrameRequestCallback>
let nextFrame: number
let root: Root | null
let result: ReturnType<typeof useScrollParentAutoFind>
let outer: HTMLDivElement
let mount: HTMLDivElement
const originalResizeObserver = globalThis.ResizeObserver
const originalMutationObserver = globalThis.MutationObserver
const originalRequestAnimationFrame = globalThis.requestAnimationFrame
const originalCancelAnimationFrame = globalThis.cancelAnimationFrame
const originalActEnvironment = (globalThis as any).IS_REACT_ACT_ENVIRONMENT

function dimensions(element: HTMLElement, values: Record<string, number>) {
  for (const [name, value] of Object.entries(values)) {
    Object.defineProperty(element, name, { configurable: true, value })
  }
}

function ScrollShell({ children, shellRef }: PropsWithChildren<{ shellRef: RefObject<HTMLDivElement> }>) {
  return <div id='fallback-scroll' className='taro-scroll' ref={shellRef} style={{ overflowX: 'auto', overflowY: 'auto' }}>{children}</div>
}

function Probe({ enabled = true, horizontal = false, omitRef = false }: ProbeOptions) {
  const contentRef = useRef<HTMLDivElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  result = useScrollParentAutoFind(contentRef, {
    enabled,
    isHorizontal: horizontal,
    contentId: 'content',
    excludeScrollElement: shellRef
  })
  const content = <div id='content' ref={omitRef ? undefined : contentRef} />
  return result.status === 'not-found' ? <ScrollShell shellRef={shellRef}>{content}</ScrollShell> : content
}

function ListProbe({ enabled = true, horizontal = false, explicitRef }: ProbeOptions) {
  const shellRef = useRef<HTMLDivElement>(null)
  const nested = useListNestedScroll(enabled ? 'nested' : 'default', explicitRef, undefined, horizontal, shellRef)
  result = { status: nested.autoFindStatus, scrollParentRef: nested.effectiveScrollElement ?? { current: null } }
  const content = <div id='content' ref={nested.contentWrapperRef} />
  return nested.autoFindStatus === 'not-found' ? <ScrollShell shellRef={shellRef}>{content}</ScrollShell> : content
}

function renderProbe(options: ProbeOptions = {}) {
  const Component = options.nestedList ? ListProbe : Probe
  let element = <Component {...options} />
  if (options.contextRef) {
    element = <ScrollElementContextOrFallback.Provider value={{ scrollRef: options.contextRef }}>{element}</ScrollElementContextOrFallback.Provider>
  }
  if (options.strict) element = <React.StrictMode>{element}</React.StrictMode>
  if (options.overflow) dimensions(outer, { scrollHeight: 300, scrollWidth: 300 })
  act(() => root!.render(element))
}

function notify(count = 1) {
  act(() => {
    for (let iteration = 0; iteration < count; iteration++) {
      observers.filter(observer => observer.disconnect.mock.calls.length === 0).forEach(observer => observer.callback())
    }
  })
}

function flushFrame() {
  act(() => {
    const callbacks = [...frames.values()]
    frames.clear()
    callbacks.forEach(callback => callback(16))
  })
}

beforeEach(() => {
  jest.useFakeTimers()
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  observers = []
  frames = new Map()
  nextFrame = 0
  globalThis.ResizeObserver = Observer as any
  globalThis.MutationObserver = Observer as any
  globalThis.requestAnimationFrame = jest.fn(callback => {
    const frame = nextFrame++
    frames.set(frame, callback)
    return frame
  })
  globalThis.cancelAnimationFrame = jest.fn(frame => { frames.delete(frame) })
  ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
  platform.isWeapp = false
  platform.isH5 = true
  outer = document.createElement('div')
  outer.className = 'taro-scroll'
  outer.style.overflowX = 'auto'
  outer.style.overflowY = 'auto'
  dimensions(outer, { clientHeight: 100, scrollHeight: 100, clientWidth: 100, scrollWidth: 100 })
  mount = document.createElement('div')
  outer.appendChild(mount)
  document.body.appendChild(outer)
  root = createRoot(mount)
})

afterEach(() => {
  if (root) act(() => root!.unmount())
  root = null
  outer.remove()
  jest.useRealTimers()
  jest.restoreAllMocks()
  globalThis.ResizeObserver = originalResizeObserver
  globalThis.MutationObserver = originalMutationObserver
  globalThis.requestAnimationFrame = originalRequestAnimationFrame
  globalThis.cancelAnimationFrame = originalCancelAnimationFrame
  ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = originalActEnvironment
})

describe('scroll parent lookup', () => {
  it('keeps the default lookup and excludes only the supplied element', () => {
    const shell = document.createElement('div')
    shell.className = 'taro-scroll'
    shell.style.overflowY = 'auto'
    const content = document.createElement('div')
    shell.appendChild(content)
    mount.appendChild(shell)
    dimensions(shell, { clientHeight: 100, scrollHeight: 115 })
    dimensions(outer, { scrollHeight: 300 })
    expect(scrollParent.findScrollParent(content)).toBe(shell)
    expect(scrollParent.findScrollParent(content, true, shell)).toBe(outer)
    outer.className = ''
    expect(scrollParent.findScrollParent(content, true, shell)).toBe(outer)
  })

  it('does not treat non-overflowing ancestors or body as scroll parents', () => {
    renderProbe({ enabled: false })
    expect(scrollParent.findScrollParent(document.getElementById('content'))).toBeNull()
    expect(scrollParent.findScrollParent(document.body)).toBeNull()
    expect(scrollParent.findScrollParent(null)).toBeNull()
  })
})

describe('automatic scroll parent recovery', () => {
  it('keeps initial success synchronous without observers or frames', () => {
    renderProbe({ overflow: true })
    expect(result.status).toBe('found')
    expect(result.scrollParentRef.current).toBe(outer)
    expect(observers).toHaveLength(0)
    expect(requestAnimationFrame).not.toHaveBeenCalled()
  })

  it('coalesces 200 deliveries into one lookup using the latest content ref', () => {
    const lookup = jest.spyOn(scrollParent, 'findScrollParent')
    renderProbe()
    const currentContent = document.getElementById('content')
    expect(lookup.mock.calls[0][0]).not.toBe(currentContent)
    notify(100)
    expect(lookup).toHaveBeenCalledTimes(1)
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)
    dimensions(outer, { scrollHeight: 300 })
    flushFrame()
    expect(lookup).toHaveBeenCalledTimes(2)
    expect(lookup.mock.calls[1][0]).toBe(currentContent)
    expect(result.scrollParentRef.current).toBe(outer)
    expect(observers.every(observer => observer.disconnect.mock.calls.length === 1)).toBe(true)
  })

  it.each([false, true])('never selects the fallback when it starts overflowing before the frame (List=%s)', nestedList => {
    renderProbe({ nestedList })
    const shell = document.getElementById('fallback-scroll')!
    dimensions(shell, { clientHeight: 100, scrollHeight: 100 })
    dimensions(outer, { scrollHeight: 300 })
    notify()
    dimensions(shell, { scrollHeight: 115 })
    flushFrame()
    expect(result.status).toBe('found')
    expect(result.scrollParentRef.current).toBe(outer)
    expect(result.scrollParentRef.current!.isConnected).toBe(true)
    expect(shell.isConnected).toBe(false)
  })

  it('keeps watching when only its own fallback overflows', () => {
    renderProbe()
    dimensions(document.getElementById('fallback-scroll')!, { clientHeight: 100, scrollHeight: 115 })
    notify()
    flushFrame()
    expect(result.status).toBe('not-found')
    expect(result.scrollParentRef.current).toBeNull()
    expect(frames.size).toBe(0)
    expect(observers.every(observer => observer.disconnect.mock.calls.length === 0)).toBe(true)
    dimensions(outer, { scrollHeight: 300 })
    notify()
    flushFrame()
    expect(result.scrollParentRef.current).toBe(outer)
  })

  it('uses horizontal overflow for a nested horizontal List', () => {
    renderProbe({ nestedList: true, horizontal: true })
    dimensions(outer, { scrollHeight: 300 })
    notify()
    flushFrame()
    expect(result.status).toBe('not-found')
    dimensions(outer, { scrollWidth: 300 })
    notify()
    flushFrame()
    expect(result.scrollParentRef.current).toBe(outer)
  })

  it('cancels frame zero on unmount and ignores late observer callbacks', () => {
    renderProbe()
    const observer = observers[0]
    notify()
    expect(frames.has(0)).toBe(true)
    act(() => root!.unmount())
    root = null
    expect(cancelAnimationFrame).toHaveBeenCalledWith(0)
    act(() => observer.callback())
    expect(frames.size).toBe(0)
  })

  it('cancels work when automatic lookup is disabled', () => {
    renderProbe()
    notify()
    renderProbe({ enabled: false })
    expect(frames.size).toBe(0)
    expect(result.status).toBe('pending')
    expect(observers.every(observer => observer.disconnect.mock.calls.length === 1)).toBe(true)
  })

  it('cleans the old frame when horizontal mode changes', () => {
    renderProbe()
    notify()
    renderProbe({ horizontal: true })
    expect(frames.size).toBe(0)
    dimensions(outer, { scrollWidth: 300 })
    notify()
    flushFrame()
    expect(result.scrollParentRef.current).toBe(outer)
  })

  it('does not retain duplicate observers in StrictMode', () => {
    renderProbe({ strict: true })
    expect(observers.filter(observer => observer.disconnect.mock.calls.length === 0)).toHaveLength(2)
    dimensions(outer, { scrollHeight: 300 })
    notify()
    flushFrame()
    expect(result.scrollParentRef.current).toBe(outer)
    expect(observers.every(observer => observer.disconnect.mock.calls.length === 1)).toBe(true)
  })

  it.each(['resize', 'mutation', 'both'])('retains the available observer when %s is missing', missing => {
    if (missing !== 'mutation') globalThis.ResizeObserver = undefined as any
    if (missing !== 'resize') globalThis.MutationObserver = undefined as any
    renderProbe()
    dimensions(outer, { scrollHeight: 300 })
    notify()
    flushFrame()
    expect(result.status).toBe(missing === 'both' ? 'not-found' : 'found')
  })

  it('waits for a resumed frame without starting a timer polling loop', () => {
    renderProbe()
    dimensions(outer, { scrollHeight: 300 })
    notify()
    act(() => jest.advanceTimersByTime(5000))
    expect(result.status).toBe('not-found')
    expect(frames.size).toBe(1)
    flushFrame()
    expect(result.status).toBe('found')
  })

  it('preserves the timer retry for an initially missing ref', () => {
    renderProbe({ omitRef: true })
    expect(observers).toHaveLength(0)
    renderProbe({ overflow: true })
    act(() => jest.advanceTimersByTime(50))
    expect(result.status).toBe('found')
    expect(requestAnimationFrame).not.toHaveBeenCalled()
  })

  it.each(['disabled', 'explicit', 'context'])('bypasses automatic lookup for %s List mode', mode => {
    const lookup = jest.spyOn(scrollParent, 'findScrollParent')
    renderProbe({
      nestedList: true,
      enabled: mode !== 'disabled',
      explicitRef: mode === 'explicit' ? { current: outer } : undefined,
      contextRef: mode === 'context' ? { current: outer } : undefined
    })
    expect(lookup).not.toHaveBeenCalled()
    expect(observers).toHaveLength(0)
    expect(requestAnimationFrame).not.toHaveBeenCalled()
    if (mode !== 'disabled') expect(result.scrollParentRef.current).toBe(outer)
  })

  it.each([false, true])('preserves the Weapp lookup and retry without DOM frames (immediate=%s)', immediate => {
    platform.isWeapp = true
    const lookup = jest.spyOn(scrollParent, 'findScrollParentTaro').mockReturnValue(immediate ? outer as any : null)
    renderProbe()
    if (!immediate) {
      expect(result.status).toBe('pending')
      lookup.mockReturnValue(outer as any)
      act(() => jest.advanceTimersByTime(50))
    }
    expect(result.status).toBe('found')
    expect(observers).toHaveLength(0)
    expect(requestAnimationFrame).not.toHaveBeenCalled()
  })
})
