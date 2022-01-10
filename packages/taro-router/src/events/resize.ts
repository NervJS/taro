import { PageInstance } from '@tarojs/runtime'

let pageResizeFn

export function bindPageResize (page: PageInstance) {
  window.removeEventListener('resize', pageResizeFn)

  pageResizeFn = function () {
    page.onResize && page.onResize({
      size: {
        height: window.innerHeight,
        width: window.innerWidth
      }
    })
  }

  window.addEventListener('resize', pageResizeFn, false)
}
