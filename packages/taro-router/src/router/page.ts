/* eslint-disable dot-notation */
import { PageInstance, requestAnimationFrame } from '@tarojs/runtime'

import { bindPageScroll } from '../scroll'
import { qs } from './qs'
import stacks from './stack'
import { Route } from './'

export function pageOnReady (page: PageInstance, pageEl: Element | null, onLoad = true) {
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

  let pageEl = document.getElementById(page.path!)
  if (pageEl) {
    pageEl.style.display = 'block'
  } else {
    page.onLoad(qs(stacksIndex), () => {
      pageEl = document.getElementById(page.path!)
      pageOnReady(page, pageEl)
    })
  }
  stacks.push(page)
  page.onShow!()
  bindPageScroll(page, pageConfig)
}

export function unloadPage (page?: PageInstance | null, delta = 1) {
  if (!page) return

  stacks.delta = --delta
  if (page !== null) {
    stacks.pop()
    page.onUnload()
  }
  if (delta >= 1) {
    return unloadPage(stacks.last, delta)
  }
}

export function showPage (page?: PageInstance | null, pageConfig: Route = {}, stacksIndex = 0) {
  if (!page) return

  page.onShow!()
  let pageEl = document.getElementById(page.path!)
  if (pageEl) {
    pageEl.style.display = 'block'
  } else {
    page.onLoad(qs(stacksIndex))
    pageEl = document.getElementById(page.path!)
    pageOnReady(page, pageEl, false)
  }
  bindPageScroll(page, pageConfig)
}

export function hidePage (page?: PageInstance | null) {
  if (!page) return

  page.onHide!()
  const pageEl = document.getElementById(page.path!)
  if (pageEl) {
    pageEl.style.display = 'none'
  }
}
