import { Current, PageInstance } from '@tarojs/runtime'
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

function getScrollContainer (): Element | Window {
  const id = Current.page?.path
  const el: HTMLDivElement | null = (id
    ? document.getElementById(id)
    : document.querySelector('.taro_page') ||
  document.querySelector('.taro_router')) as HTMLDivElement
  return el || window
}

function getOffset () {
  if (pageDOM instanceof Window) {
    return document.documentElement.scrollHeight - window.scrollY - window.innerHeight
  } else {
    return pageDOM.scrollHeight - pageDOM.scrollTop - pageDOM.clientHeight
  }
}
