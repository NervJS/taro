import { createBrowserHistory } from 'history'

import PageHandler from '../src/router/page'

import type { PageInstance } from '@tarojs/runtime'
import type { SpaRouterConfig } from '../types/router'

function createPage (path: string) {
  return {
    path,
    $taroParams: { stamp: 'page-test' },
    onShow: jest.fn(),
    onHide: jest.fn()
  }
}

function createContainer (path: string) {
  const el = document.createElement('div')
  el.id = path
  el.className = 'taro_page'
  document.body.appendChild(el)
  return el
}

function createHandler () {
  const config: SpaRouterConfig = {
    pages: ['a', 'b'],
    routes: [{ path: '/a' }, { path: '/b' }],
    router: { mode: 'browser', basename: '', pathname: '/a' },
    animation: { duration: 300, delay: 50 },
    window: { navigationStyle: 'custom' }
  }
  return new PageHandler(config, createBrowserHistory())
}

beforeEach(() => {
  jest.useFakeTimers()
  jest.spyOn(window, 'addEventListener')
})

afterEach(() => {
  for (const [type, listener] of (window.addEventListener as jest.Mock).mock.calls) {
    // 路由与页面监听器需要在测试间清理，避免影响后续用例。
    if (type === 'resize' || type === 'popstate') window.removeEventListener(type, listener)
  }
  jest.restoreAllMocks()
  jest.clearAllTimers()
  jest.useRealTimers()
  document.body.innerHTML = ''
})

test('a page stays visible when it is shown before its pending hide timer runs', () => {
  const page = createPage('/a')
  const pageEl = createContainer('/a')
  const handler = createHandler()

  handler.hide(page as unknown as PageInstance, true)
  jest.advanceTimersByTime(325)
  handler.show(page as unknown as PageInstance)
  jest.advanceTimersByTime(25)

  expect(pageEl.classList.contains('taro_page_shade')).toBe(false)
  expect(page.onHide).toHaveBeenCalledTimes(1)
  expect(page.onShow).toHaveBeenCalledTimes(1)
})

test('showing another page keeps the pending hide for the previous page', () => {
  const firstPage = createPage('/a')
  const nextPage = createPage('/b')
  const firstEl = createContainer('/a')
  const nextEl = createContainer('/b')
  const handler = createHandler()

  handler.hide(firstPage as unknown as PageInstance, true)
  handler.show(nextPage as unknown as PageInstance)
  jest.advanceTimersByTime(350)

  expect(firstEl.classList.contains('taro_page_shade')).toBe(true)
  expect(nextEl.classList.contains('taro_page_shade')).toBe(false)
})

test('a page can be shown after its hide timer has completed', () => {
  const page = createPage('/a')
  const pageEl = createContainer('/a')
  const handler = createHandler()

  handler.hide(page as unknown as PageInstance, true)
  jest.advanceTimersByTime(350)
  expect(pageEl.classList.contains('taro_page_shade')).toBe(true)

  handler.show(page as unknown as PageInstance)
  expect(pageEl.classList.contains('taro_page_shade')).toBe(false)
})
