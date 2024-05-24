/**
 * 插入页面动画需要的样式
 */
export function loadAnimateStyle (ms = 300) {
  const css = `
body {
  /* 防止 iOS 页面滚动 */
  overflow: hidden;
}
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
  transition: none;
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
export function loadRouterStyle (enableTabBar: boolean, enableWindowScroll: boolean) {
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
  enableWindowScroll ? '' : `
    overflow-x: hidden;
    overflow-y: scroll;
    max-height: 100vh;
`}
  }
${
  enableTabBar ? `
  .taro-tabbar__container > .taro-tabbar__panel {
    overflow: hidden;
  }

  .taro-tabbar__container > .taro-tabbar__panel > .taro_page.taro_tabbar_page {
    max-height: calc(100vh - var(--taro-tabbar-height) - constant(safe-area-inset-bottom));
    max-height: calc(100vh - var(--taro-tabbar-height) - env(safe-area-inset-bottom));
  }

` : ''}
  .taro_page_shade:has(+.taro_page_stationed),
  .taro_page_shade.taro_tabbar_page,
  .taro_router > .taro_page.taro_page_show.taro_page_stationed:not(.taro_page_shade):not(.taro_tabbar_page):not(:last-child):has(+.taro_page_stationed) {
    display: none;
  }
`
  addStyle(css)
}

/**
 * 插入导航栏相关的样式
*/
export function loadNavigationBarStyle () {
  const css = `
  .taro-navigation-bar-show {
    display: flex;
    background: white;
    position: sticky;
    z-index: 500;
    top: 0;
    padding-bottom: 8px;
    padding-top: calc(env(safe-area-inset-top) + 8px);
    justify-content: center;
    align-items: center;
  }

  .taro-navigation-bar-hide {
    display: none;
  }

  .taro-navigation-bar-title-wrap {
    display: flex;
    height: 24px;
  }

  .taro-navigation-bar-title-wrap > .taro-navigation-bar-loading {
    display: none;
    animation: loading 2s linear infinite;
  }

  .taro-navigation-bar-title-wrap .taro-navigation-bar-loading.taro-navigation-bar-loading-show {
    display: flex;
  }

  .taro-navigation-bar-title-wrap > .taro-navigation-bar-title {
    font-size: 24px;
    height: 24px;
    line-height: 24px;
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    line-height: 24px;
    text-overflow: ellipsis;
  }

  @keyframes loading {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes loading {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .taro-navigation-bar-no-icon > .taro-navigation-bar-home {
    display: none;
  }

  .taro-navigation-bar-no-icon > .taro-navigation-bar-back {
    display: none;
  }

  .taro-navigation-bar-home-icon > .taro-navigation-bar-home {
    display: flex;
    left: 8px;
    position: absolute;
    width: 24px;
    height: 24px;
  }

  .taro-navigation-bar-back-icon > .taro-navigation-bar-back {
    display: flex;
    left: 8px;
    position: absolute;
    width: 24px;
    height: 24px;
  }
`
  addStyle(css)
}

export function addStyle (css) {
  if (!css) return
  const style = document.createElement('style')
  style.innerHTML = css
  document.getElementsByTagName('head')[0].appendChild(style)
}
