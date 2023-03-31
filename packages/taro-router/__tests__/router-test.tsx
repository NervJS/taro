import Taro from '@tarojs/taro-h5'
import React from 'react'
import ReactDOM from 'react-dom'

import { history } from '../src/history'
import { createRouter } from '../src/index'

window.scrollTo = jest.fn()
const wait = (timeout) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeout)
  })
}

beforeEach(() => {
  const inst = {}
  createRouter(inst, {
    entryPagePath: '/pages/index/index',
    router: {
      mode: 'browser',
      basename: '/',
      customRoutes: {
        '/pages/index/index': '/index',
        '/pages/about/index': '/about'
      },
      pathname: '/'
    },
    routes: [
      { path: 'pages/index/index', load: jest.fn() },
      { path: 'pages/about/about', load: jest.fn() },
    ]
  }, 'React')
})

describe.skip('router component', () => {

  it('should work!', async () => {
    const url1 = '/pages/index/index'
    const url2 = '/pages/about/index'

    class Base extends React.Component {
      idx
      render () {
        return (
          <div>{this.idx}</div>
        )
      }
    }

    const getPage = idx => {
      return class Page extends Base {
        idx = idx
      }
    }

    class RouterComponent extends React.Component {
      render () {
        return (
          <Router
            mode={'hash'}
            history={history}
            routes={[{
              path: url1,
              componentLoader: () => Promise.resolve({
                default: getPage(0)
              }),
              isIndex: true
            }, {
              path: url2,
              componentLoader: () => Promise.resolve({
                default: getPage(1)
              }),
              isIndex: false
            }]}
            customRoutes={{
              "/pages/index/index": "/index",
              "/pages/about/index": "/about"
            }}
          />
        )
      }
    }

    const routerComponent: any = <RouterComponent />
    const getComputedStyle = window.getComputedStyle
    ReactDOM.render(routerComponent, document.createElement('div'))
    const dom = routerComponent.dom

    await wait(100)
    expect(window.getComputedStyle(dom.childNodes[0]).display).toEqual('block')
    Taro.navigateTo({
      url: '/pages/about/index'
    })
    await wait(100)
    expect(getComputedStyle(dom.childNodes[0]).display).toEqual('none')
    expect(getComputedStyle(dom.childNodes[1]).display).toEqual('block')
  })

  it('should be able to get $router property via this', async () => {
    const url1 = '/pages/index/index'
    const url2 = '/pages/about/index'
    let routerParams
    class Page extends React.Component {
      render() {
        routerParams = this.$router
        return (
          <div />
        )
      }
    }
    const componentLoader = () => Promise.resolve({
      default: Page
    })

    class RouterComponent extends React.Component {
      render () {
        return (
          <Router
            mode={'hash'}
            history={history}
            routes={[{
              path: url1,
              componentLoader,
              isIndex: true
            }, {
              path: url2,
              componentLoader,
              isIndex: false
            }]}
            customRoutes={{
              "/pages/index/index": "/index",
              "/pages/about/index": "/about"
            }}
          />
        )
      }
    }
    ReactDOM.render(<RouterComponent />, document.createElement('div'))
    await wait(100)
    expect(routerParams).toMatchObject({})
    Taro.navigateTo({
      url: '/pages/about/index'
    })
    await wait(100)
    expect(routerParams).toMatchObject({})
  })
})
