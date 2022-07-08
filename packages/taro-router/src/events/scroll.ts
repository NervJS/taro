import { PageInstance } from '@tarojs/runtime'

let pageScrollFn
let pageDOM: Element | Window = window

export function bindPageScroll (page: PageInstance, pageEl: HTMLElement, distance = 50) {
  pageScrollFn && pageEl.removeEventListener('scroll', pageScrollFn)
  pageDOM = pageEl

  let isReachBottom = false

  pageScrollFn = function () {
    page.onPageScroll?.({
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

function getOffset () {
  if (pageDOM instanceof Window) {
    return document.documentElement.scrollHeight - window.scrollY - window.innerHeight
  } else {
    return pageDOM.scrollHeight - pageDOM.scrollTop - pageDOM.clientHeight
  }
}
