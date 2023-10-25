import { Current, PageInstance } from '@tarojs/runtime'

const pageScrollFn = {}
let pageDOM: Element | Window = window

export function bindPageScroll (page: PageInstance, scrollEl: HTMLElement | Window, distance = 50) {
  const pagePath = (page ? page?.path : Current.router?.path) as string
  pageScrollFn[pagePath] && scrollEl.removeEventListener('scroll', pageScrollFn[pagePath])
  pageDOM = scrollEl

  let isReachBottom = false

  pageScrollFn[pagePath] = function () {
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

  pageDOM.addEventListener('scroll', pageScrollFn[pagePath], false)
}

function getOffset () {
  if (pageDOM instanceof Window) {
    return document.documentElement.scrollHeight - window.scrollY - window.innerHeight
  } else {
    return pageDOM.scrollHeight - pageDOM.scrollTop - pageDOM.clientHeight
  }
}
