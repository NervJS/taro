import type { PageInstance } from '@tarojs/runtime'
import { PageConfig } from '@tarojs/taro'

let pageScrollFn

export function bindPageScroll (page: PageInstance, config: Partial<PageConfig>) {
  window.removeEventListener('scroll', pageScrollFn)

  const distance = config.onReachBottomDistance || 50
  let isReachBottom = false

  pageScrollFn = function () {
    page.onPageScroll && page.onPageScroll({
      scrollTop: window.scrollY
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

  window.addEventListener('scroll', pageScrollFn, false)
}

function getOffset () {
  return document.documentElement.scrollHeight - window.scrollY - window.innerHeight
}
