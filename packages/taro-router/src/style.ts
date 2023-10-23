/**
 * 插入页面动画需要的样式
 */
export function loadAnimateStyle (ms = 300) {
  const css = `
.taro_router > .taro_page {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  transform: translate(100%, 0);
  transition: transform ${ms}ms;
  z-index: 0;
}

.taro_router > .taro_page.taro_tabbar_page,
.taro_router > .taro_page.taro_page_show.taro_page_stationed {
  transform: none;
}

.taro_router > .taro_page.taro_page_show {
  transform: translate(0, 0);
}
`
  addStyle(css)
}

/**
 * 插入路由相关样式
 */
export function loadRouterStyle (usingWindowScroll: boolean) {
  const css = `
  .taro_router {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .taro_page {
    width: 100%;
    height: 100%;
  ${
  usingWindowScroll ? '' : `
    overflow-x: hidden;
    overflow-y: scroll;
    max-height: 100vh;
  `}
  }

  .taro-tabbar__container > .taro-tabbar__panel {
    overflow: hidden;
  }

  .taro-tabbar__container > .taro-tabbar__panel > .taro_page.taro_tabbar_page {
    max-height: calc(100vh - var(--taro-tabbar-height) - constant(safe-area-inset-bottom));
    max-height: calc(100vh - var(--taro-tabbar-height) - env(safe-area-inset-bottom));
  }

  .taro_page_shade,
  .taro_router > .taro_page.taro_page_show.taro_page_stationed:not(.taro_page_shade):not(.taro_tabbar_page):not(:last-child) {
    display: none;
  }
`
  addStyle(css)
}

function addStyle (css) {
  if (!css) return
  const style = document.createElement('style')
  style.innerHTML = css
  document.getElementsByTagName('head')[0].appendChild(style)
}
