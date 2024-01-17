export function initNavigationBar (container:HTMLElement) {
  const navigationBar = document.createElement('taro-navigation-bar-wrap')
  const navigationBarBackBtn = document.createElement('taro-navigation-bar-back')
  const navigationBarHomeBtn = document.createElement('taro-navigation-bar-home')
  const navigationBarTitle = document.createElement('taro-navigation-bar-title')
  navigationBar.appendChild(navigationBarHomeBtn)
  navigationBar.appendChild(navigationBarBackBtn)
  navigationBar.appendChild(navigationBarTitle)
  navigationBar.id = 'taro-navigation-bar'
  container.prepend(navigationBar)
}