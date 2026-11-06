import { Current } from '@tarojs/runtime'

import type { PageInstance } from '@tarojs/runtime'

const pageScrollBindings = new Map<string, {
  target: HTMLElement | Window
  listener: EventListener
}>()

export function bindPageScroll (page: PageInstance, scrollEl: HTMLElement | Window, distance = 50) {
  const pagePath = (page ? page?.path : Current.router?.path) as string
  const previous = pageScrollBindings.get(pagePath)
  previous?.target.removeEventListener('scroll', previous.listener)

  let isReachBottom = false

  const listener = function () {
    page.onPageScroll?.({
      scrollTop: scrollEl instanceof Window ? scrollEl.scrollY : scrollEl.scrollTop
    })

    if (isReachBottom && getOffset(scrollEl) > distance) {
      isReachBottom = false
    }

    if (
      page.onReachBottom &&
      !isReachBottom &&
      getOffset(scrollEl) < distance
    ) {
      isReachBottom = true
      page.onReachBottom()
    }
  }

  pageScrollBindings.set(pagePath, { target: scrollEl, listener })
  scrollEl.addEventListener('scroll', listener, false)
}

function getOffset (scrollEl: HTMLElement | Window) {
  if (scrollEl instanceof Window) {
    return scrollEl.document.documentElement.scrollHeight - scrollEl.scrollY - scrollEl.innerHeight
  } else {
    return scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight
  }
}
