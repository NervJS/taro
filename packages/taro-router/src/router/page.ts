/* eslint-disable dot-notation */
import { PageInstance, requestAnimationFrame } from '@tarojs/runtime'

import { bindPageScroll } from '../scroll'
import { qs } from './qs'
import { stacks } from './stack'
import { Route } from './'

export function hidePage (page: PageInstance | null) {
  if (page != null) {
    page.onHide!()
    const pageEl = document.getElementById(page.path!)
    if (pageEl) {
      pageEl.style.display = 'none'
    }
  }
}

export function showPage (page: PageInstance | null, pageConfig: Route = {}, stacksIndex = 0) {
  if (page != null) {
    page.onShow!()
    let pageEl = document.getElementById(page.path!)
    if (pageEl) {
      pageEl.style.display = 'block'
    } else {
      page.onLoad(qs(stacksIndex))
      pageEl = document.getElementById(page.path!)
      pageOnReady(pageEl, page, false)
    }
    bindPageScroll(page, pageConfig)
  }
}

export function unloadPage (page: PageInstance | null) {
  if (page != null) {
    stacks.pop()
    page.onUnload()
  }
}

export function pageOnReady (pageEl: Element | null, page: PageInstance, onLoad = true) {
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

export function loadPage (page: PageInstance | null, pageConfig: Route = {}, stacksIndex = 0) {
  if (page !== null) {
    let pageEl = document.getElementById(page.path!)
    if (pageEl) {
      pageEl.style.display = 'block'
    } else {
      page.onLoad(qs(stacksIndex), function () {
        pageEl = document.getElementById(page.path!)
        pageOnReady(pageEl, page)
      })
    }
    stacks.push(page)
    page.onShow!()
    bindPageScroll(page, pageConfig)
  }
}
