import { PageInstance } from '@tarojs/runtime'

let pageResizeFn

export function bindPageResize (page: PageInstance) {
  pageResizeFn && window.removeEventListener('resize', pageResizeFn)

  pageResizeFn = function () {
    if (page.onResize) {
      const mediaQuery = window.matchMedia('(orientation: portrait)')
      page.onResize({
        deviceOrientation: mediaQuery.matches ? 'portrait' : 'landscape',
        size: {
          windowHeight: window.innerHeight,
          windowWidth: window.innerWidth,
          screenHeight: window.screen.height,
          screenWidth: window.screen.width,
        }
      })
    }
  }

  window.addEventListener('resize', pageResizeFn, false)
}
