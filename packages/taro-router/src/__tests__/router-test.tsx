import Taro from '@tarojs/taro-h5'
import Nerv from 'nervjs'

import mountApis from '../apis'
import createHistory from '../history/createHistory'
import Router from '../router/router'

let mockHistory

window.scrollTo = jest.fn()
const wait = (timeout) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeout)
  })
}

beforeEach(() => {
  mockHistory = createHistory({
    mode: 'browser',
    basename: '/',
    firstPagePath: '/pages/index/index',
    customRoutes: {
      '/pages/index/index': '/index',
      '/pages/about/index': '/about'
    }
  })
  mountApis(mockHistory)
})

describe('router component', () => {

  it('should work!', async done => {
    const url1 = '/pages/index/index'
    const url2 = '/pages/about/index'

    class Base extends Taro.Component {
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

    class RouterComponent extends Taro.Component {
      render () {
        return (
          <Router
            history={mockHistory}
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

    const routerComponent = <RouterComponent />
    const getComputedStyle = window.getComputedStyle
    Nerv.render(routerComponent, document.createElement('div'))
    const dom = routerComponent.dom

    await wait(100)
    expect(window.getComputedStyle(dom.childNodes[0]).display).toEqual('block')
    Taro.navigateTo({
      url: '/pages/about/index'
    })
    await wait(100)
    expect(getComputedStyle(dom.childNodes[0]).display).toEqual('none')
    expect(getComputedStyle(dom.childNodes[1]).display).toEqual('block')
    done()
  })

  it('should be able to get $router property via this', async done => {
    const url1 = '/pages/index/index'
    const url2 = '/pages/about/index'
    let routerParams
    class Page extends Taro.Component {
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

    class RouterComponent extends Taro.Component {
      render () {
        return (
          <Router
            history={mockHistory}
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
    Nerv.render(<RouterComponent />, document.createElement('div'))
    await wait(100)
    expect(routerParams).toMatchObject({})
    Taro.navigateTo({
      url: '/pages/about/index'
    })
    await wait(100)
    expect(routerParams).toMatchObject({})
    done()
  })
})
