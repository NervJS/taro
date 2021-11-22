/* eslint-disable dot-notation */
import { PageInstance, requestAnimationFrame } from '@tarojs/runtime'

import { bindPageScroll } from '../scroll'
import { qs } from './qs'
import stacks from './stack'
import { Route } from './'

export function pageOnReady (page: PageInstance, onLoad = true) {
  const pageEl = document.getElementById(page.path!)
  if (pageEl && !pageEl?.['__isReady']) {
    const el = pageEl.firstElementChild
    el?.['componentOnReady']?.().then(() => {
      requestAnimationFrame(() => {
        page.onReady!()
        pageEl!['__isReady'] = true
      })
    })
    onLoad && (pageEl['__page'] = page)
  }
}

export function loadPage (page: PageInstance, pageConfig: Route = {}, stacksIndex = 0) {
  if (!page) return

  const pageEl = document.getElementById(page.path!)
  if (pageEl) {
    pageEl.style.display = 'block'
  } else {
    page.onLoad(qs(stacksIndex), () => pageOnReady(page, true))
  }
  stacks.push(page)
  page.onShow!()
  bindPageScroll(page, pageConfig)
}

export function unloadPage (page?: PageInstance | null, delta = 1) {
  if (!page) return

  stacks.delta = --delta
  stacks.pop()
  page.onUnload()
  if (delta >= 1) unloadPage(stacks.last, delta)
}

export function showPage (page?: PageInstance | null, pageConfig: Route = {}, stacksIndex = 0) {
  if (!page) return

  page.onShow!()
  const pageEl = document.getElementById(page.path!)
  if (pageEl) {
    pageEl.style.display = 'block'
  } else {
    page.onLoad(qs(stacksIndex), () => pageOnReady(page, false))
  }
  bindPageScroll(page, pageConfig)
}

export function hidePage (page?: PageInstance | null) {
  if (!page) return

  // NOTE: 修复多页并发问题，此处可能因为路由跳转过快，执行时页面可能还没有创建成功
  const pageEl = document.getElementById(page.path!)
  if (pageEl) {
    pageEl.style.display = 'none'
    page.onHide!()
  } else {
    setTimeout(() => hidePage(page), 0)
  }
}
