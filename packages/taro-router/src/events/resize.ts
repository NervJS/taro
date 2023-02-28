import { PageInstance } from '@tarojs/runtime'

let pageResizeFn

export function bindPageResize (page: PageInstance) {
  pageResizeFn && window.removeEventListener('resize', pageResizeFn)

  pageResizeFn = function () {
    page.onResize && page.onResize({
      size: {
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
      }
    })
  }

  window.addEventListener('resize', pageResizeFn, false)
}
