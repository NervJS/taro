import { createBrowserHistory } from 'history'

import MultiPageHandler from '../src/router/multi-page'
import PageHandler from '../src/router/page'

import type { PageInstance } from '@tarojs/runtime'
import type { SpaRouterConfig } from '../types/router'

function createPage (path: string) {
  return {
    path,
    $taroParams: { stamp: 'scroll-test' },
    onShow: jest.fn(),
    onHide: jest.fn(),
    onLoad: jest.fn((_params, done) => done()),
    onPageScroll: jest.fn(),
    onReachBottom: jest.fn()
  }
}

function createContainer (path: string, top = 0) {
  const el = document.createElement('div')
  el.id = path
  el.className = 'taro_page'
  el.scrollTop = top
  Object.defineProperties(el, {
    scrollHeight: { value: 1000 },
    clientHeight: { value: 200 }
  })
  document.body.appendChild(el)
  return el
}

const config = (): SpaRouterConfig => ({
  pages: ['a', 'b'],
  routes: [{ path: '/a' }, { path: '/b' }],
  router: { mode: 'browser', basename: '', pathname: '/a' },
  animation: false,
  window: { navigationStyle: 'custom' }
})

beforeEach(() => {
  jest.useFakeTimers()
  jest.spyOn(window, 'addEventListener')
})

afterEach(() => {
  for (const [type, listener] of (window.addEventListener as jest.Mock).mock.calls) {
    if (type === 'resize' || type === 'popstate') window.removeEventListener(type, listener)
  }
  jest.restoreAllMocks()
  jest.clearAllTimers()
  jest.useRealTimers()
  document.body.innerHTML = ''
})

test('SPA show/hide and return keep page containers isolated without duplicate callbacks', () => {
  const a = createPage('/a')
  const b = createPage('/b')
  const aEl = createContainer('/a', 17)
  const bEl = createContainer('/b', 99)
  const handler = new PageHandler(config(), createBrowserHistory())
  handler.pathname = '/a'
  handler.show(a as unknown as PageInstance)
  handler.hide(a as unknown as PageInstance)
  handler.pathname = '/b'
  handler.show(b as unknown as PageInstance)

  aEl.dispatchEvent(new Event('scroll'))
  expect(a.onPageScroll).toHaveBeenLastCalledWith({ scrollTop: 17 })
  expect(b.onPageScroll).not.toHaveBeenCalled()
  handler.hide(b as unknown as PageInstance)
  handler.pathname = '/a'
  handler.show(a as unknown as PageInstance)
  a.onPageScroll.mockClear()
  aEl.dispatchEvent(new Event('scroll'))
  expect(a.onPageScroll).toHaveBeenCalledTimes(1)
  expect(a.onPageScroll).toHaveBeenCalledWith({ scrollTop: 17 })
  expect(a.onShow).toHaveBeenCalledTimes(2)
  expect(a.onHide).toHaveBeenCalledTimes(1)
  expect(bEl.classList.contains('taro_page_shade')).toBe(true)
})

test('SPA returning to a recreated container detaches the previous container', () => {
  const current = createPage('/a')
  const oldEl = createContainer('/a')
  const handler = new PageHandler(config(), createBrowserHistory())
  handler.pathname = '/a'
  handler.show(current as unknown as PageInstance)
  handler.hide(current as unknown as PageInstance)
  oldEl.remove()
  const newEl = createContainer('/a', 780)
  handler.show(current as unknown as PageInstance)

  oldEl.dispatchEvent(new Event('scroll'))
  expect(current.onPageScroll).not.toHaveBeenCalled()
  newEl.dispatchEvent(new Event('scroll'))
  expect(current.onPageScroll).toHaveBeenCalledTimes(1)
  expect(current.onPageScroll).toHaveBeenCalledWith({ scrollTop: 780 })
  expect(current.onReachBottom).toHaveBeenCalledTimes(1)
})

test('MPA loading with a replacement container removes the previous binding', () => {
  const current = createPage('/a')
  const oldEl = createContainer('/a')
  const handler = new MultiPageHandler({
    ...config(),
    pageName: 'a',
    route: { path: '/a', usingWindowScroll: false }
  }, createBrowserHistory())
  handler.load(current as unknown as PageInstance)
  oldEl.remove()
  const newEl = createContainer('/a', 780)
  handler.load(current as unknown as PageInstance)

  oldEl.dispatchEvent(new Event('scroll'))
  expect(current.onPageScroll).not.toHaveBeenCalled()
  newEl.dispatchEvent(new Event('scroll'))
  expect(current.onPageScroll).toHaveBeenCalledTimes(1)
  expect(current.onPageScroll).toHaveBeenCalledWith({ scrollTop: 780 })
  expect(current.onReachBottom).toHaveBeenCalledTimes(1)
})
