import type { PageInstance } from '@tarojs/runtime'
import { PageConfig } from '@tarojs/taro'

let pageScrollFn
let pageDOM: Element | Window = window

export function bindPageScroll (page: PageInstance, config: Partial<PageConfig>) {
  pageDOM.removeEventListener('scroll', pageScrollFn)
  pageDOM = getScrollContainer()

  const distance = config.onReachBottomDistance || 50
  let isReachBottom = false

  pageScrollFn = function () {
    page.onPageScroll && page.onPageScroll({
      scrollTop: pageDOM instanceof Window ? window.scrollY : pageDOM.scrollTop
    })

    if (isReachBottom && getOffset() > distance) {
      isReachBottom = false
    }

    if (
      page.onReachBottom &&
      !isReachBottom &&
      getOffset() < distance
    ) {
      isReachBottom = true
      page.onReachBottom()
    }
  }

  pageDOM.addEventListener('scroll', pageScrollFn, false)
}

window.addEventListener('DOMSubtreeModified', (e) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const className = e.target?.className
  if (className && /taro-tabbar__/.test(className)) {
    pageDOM.removeEventListener('scroll', pageScrollFn)
    pageDOM = getScrollContainer()
    pageDOM.addEventListener('scroll', pageScrollFn, false)
  }
}, false)

function getScrollContainer (): Window {
  return window
}

function getOffset () {
  if (pageDOM instanceof Window) {
    return document.documentElement.scrollHeight - window.scrollY - window.innerHeight
  } else {
    return pageDOM.scrollHeight - pageDOM.scrollTop - pageDOM.clientHeight
  }
}
