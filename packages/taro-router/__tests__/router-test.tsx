/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

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
  mountApis({ customRoutes: {}, basename: '', currentPagename: 'pages/index/index' }, mockHistory)
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
            mode={'hash'}
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

    const routerComponent: any = <RouterComponent />
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
            mode={'hash'}
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
