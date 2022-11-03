import { createReactApp } from '@tarojs/plugin-framework-react/dist/runtime'
import { createRouter } from '@tarojs/router'
import React, { Component, PropsWithChildren } from 'react'
import ReactDOM from 'react-test-renderer'

const appConfig: any = {
  pages: [
    'pages/index/index',
    'pages/about/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#333',
    selectedColor: '#409EFF',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [{
      pagePath: '/pages/index/index', text: '首页'
    }, {
      pagePath: '/pages/about/about', text: '关于我们'
    }],
    mode: 'hash',
    basename: '/test/app',
    customRoutes: {
      '/pages/about/index': '/about'
    }
  },
  router: { mode: 'hash' }
}

export function waitForChange (dom) {
  return new Promise<void>((resolve) => {
    let timer

    const observer = new MutationObserver(() => {
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        observer.disconnect()
        resolve()
      }, 1000)
    })

    setTimeout(() => {
      resolve()
    }, 5000)

    observer.observe(dom, { attributes: true, childList: true, subtree: true })
  })
}

export const delay = (ms = 500) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export function buildApp () {
  const config: any = { ...appConfig }
  class App extends Component<PropsWithChildren> {
    render () {
      return this.props.children
    }
  }
  config.routes = [
    config.pages?.map(path => ({ path, load: () => null }))
  ]
  const inst = createReactApp(App, React, ReactDOM, config)
  createRouter(inst, config, 'React')
}
