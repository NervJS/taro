import { Current, PageInstance } from '@tarojs/runtime'
import { PageConfig } from '@tarojs/taro'

import { bindPageScroll } from './scroll'
import { bindPageResize } from './resize'

export function bindPageEvents (page: PageInstance, pageEl?: HTMLElement | null, config: Partial<PageConfig> = {}) {
  if (!pageEl) {
    pageEl = getPageContainer()
  }
  bindPageScroll(page, pageEl, config)
  bindPageResize(page)
}

function getPageContainer (): HTMLElement {
  const id = Current.page?.path
  const el: HTMLDivElement | null = (id
    ? document.getElementById(id)
    : document.querySelector('.taro_page') ||
  document.querySelector('.taro_router')) as HTMLDivElement
  return el || window
}
