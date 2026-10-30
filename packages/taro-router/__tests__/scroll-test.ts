import { bindPageScroll } from '../src/events/scroll'

import type { PageInstance } from '@tarojs/runtime'

let nextPath = 0
const windowScrollY = Object.getOwnPropertyDescriptor(window, 'scrollY')!
const documentScrollHeight = Object.getOwnPropertyDescriptor(document.documentElement, 'scrollHeight')
const windowHasInstance = Object.getOwnPropertyDescriptor(Window, Symbol.hasInstance)

beforeAll(() => {
  // Jest exposes window through a VM proxy that fails the native instanceof check.
  const hasInstance = Window[Symbol.hasInstance]
  Object.defineProperty(Window, Symbol.hasInstance, {
    configurable: true,
    value (instance: unknown) {
      return instance === window || hasInstance.call(this, instance)
    }
  })
})

afterAll(() => {
  if (windowHasInstance) {
    Object.defineProperty(Window, Symbol.hasInstance, windowHasInstance)
  } else {
    delete (Window as any)[Symbol.hasInstance]
  }
})

function page (path = `/scroll-${nextPath++}`) {
  return { path, onPageScroll: jest.fn(), onReachBottom: jest.fn() } as unknown as PageInstance & {
    onPageScroll: jest.Mock
    onReachBottom: jest.Mock
  }
}

function container (top = 0) {
  const el = document.createElement('div')
  el.scrollTop = top
  Object.defineProperties(el, {
    scrollHeight: { configurable: true, value: 1000 },
    clientHeight: { configurable: true, value: 200 }
  })
  document.body.appendChild(el)
  return el
}

function scroll (target: HTMLElement | Window, top: number) {
  if (target instanceof Window) {
    Object.defineProperty(target, 'scrollY', { configurable: true, value: top })
  } else {
    target.scrollTop = top
  }
  target.dispatchEvent(new Event('scroll'))
}

beforeEach(() => {
  jest.spyOn(window, 'addEventListener')
})

afterEach(() => {
  const calls = (window.addEventListener as jest.Mock).mock.calls
  for (const [type, listener] of calls) {
    if (type === 'scroll') window.removeEventListener(type, listener)
  }
  jest.restoreAllMocks()
  Object.defineProperty(window, 'scrollY', windowScrollY)
  if (documentScrollHeight) {
    Object.defineProperty(document.documentElement, 'scrollHeight', documentScrollHeight)
  } else {
    delete (document.documentElement as any).scrollHeight
  }
  document.body.innerHTML = ''
})

describe('page scroll bindings', () => {
  test('each page reads its own scroll container', () => {
    const a = page()
    const b = page()
    const aEl = container(17)
    const bEl = container(99)
    bindPageScroll(a, aEl)
    bindPageScroll(b, bEl)
    aEl.dispatchEvent(new Event('scroll'))
    expect(a.onPageScroll).toHaveBeenCalledWith({ scrollTop: 17 })
    expect(b.onPageScroll).not.toHaveBeenCalled()
  })

  test('reach-bottom checks and resets use the bound container', () => {
    const a = page()
    const b = page()
    const aEl = container()
    bindPageScroll(a, aEl, 50)
    bindPageScroll(b, container(799), 50)
    scroll(aEl, 100)
    expect(a.onReachBottom).not.toHaveBeenCalled()
    scroll(aEl, 780)
    scroll(aEl, 790)
    expect(a.onReachBottom).toHaveBeenCalledTimes(1)
    scroll(aEl, 100)
    scroll(aEl, 780)
    expect(a.onReachBottom).toHaveBeenCalledTimes(2)
    expect(b.onReachBottom).not.toHaveBeenCalled()
  })

  test('rebinding a path removes its listener from the old container', () => {
    const original = page()
    const replacement = page(original.path)
    const oldEl = container()
    const newEl = container()
    bindPageScroll(original, oldEl)
    bindPageScroll(replacement, newEl)
    scroll(oldEl, 780)
    expect(original.onPageScroll).not.toHaveBeenCalled()
    expect(original.onReachBottom).not.toHaveBeenCalled()
    scroll(newEl, 780)
    expect(replacement.onPageScroll).toHaveBeenCalledTimes(1)
    expect(replacement.onReachBottom).toHaveBeenCalledTimes(1)
  })

  test('repeated binding to the same container keeps one listener', () => {
    const current = page()
    const el = container()
    bindPageScroll(current, el)
    bindPageScroll(current, el)
    bindPageScroll(current, el)
    scroll(el, 780)
    expect(current.onPageScroll).toHaveBeenCalledTimes(1)
    expect(current.onReachBottom).toHaveBeenCalledTimes(1)
  })

  test.each(['window to element', 'element to window'])('rebinding from %s detaches the previous target', direction => {
    const current = page()
    const el = container()
    const [oldTarget, newTarget] = direction === 'window to element' ? [window, el] : [el, window]
    bindPageScroll(current, oldTarget)
    bindPageScroll(current, newTarget)
    scroll(oldTarget, 100)
    expect(current.onPageScroll).not.toHaveBeenCalled()
    scroll(newTarget, 200)
    expect(current.onPageScroll).toHaveBeenCalledTimes(1)
    expect(current.onPageScroll).toHaveBeenCalledWith({ scrollTop: 200 })
  })

  test('a window binding keeps using window metrics after an element is bound', () => {
    const current = page()
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: window.innerHeight + 100 })
    bindPageScroll(current, window)
    bindPageScroll(page(), container(400))
    scroll(window, 80)
    expect(current.onPageScroll).toHaveBeenCalledWith({ scrollTop: 80 })
    expect(current.onReachBottom).toHaveBeenCalledTimes(1)
  })

  test('an element binding keeps its metrics after a window is bound', () => {
    const current = page()
    const el = container()
    bindPageScroll(current, el)
    bindPageScroll(page(), window)
    scroll(el, 780)
    expect(current.onPageScroll).toHaveBeenCalledWith({ scrollTop: 780 })
    expect(current.onReachBottom).toHaveBeenCalledTimes(1)
  })

  test('preserves the default threshold and strict reach-bottom boundary', () => {
    const current = page()
    const el = container()
    bindPageScroll(current, el)
    scroll(el, 750)
    expect(current.onReachBottom).not.toHaveBeenCalled()
    scroll(el, 751)
    scroll(el, 799)
    expect(current.onReachBottom).toHaveBeenCalledTimes(1)
    scroll(el, 749)
    scroll(el, 751)
    expect(current.onReachBottom).toHaveBeenCalledTimes(2)
  })

  test('supports pages without scroll callbacks', () => {
    const el = container()
    bindPageScroll({ path: `/empty-${nextPath++}` } as PageInstance, el)
    expect(() => scroll(el, 780)).not.toThrow()
  })
})
