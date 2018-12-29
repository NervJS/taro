import Nerv from 'nervjs'
import { Component } from '@tarojs/taro-h5'
import Router from '../src/router/router'
import createHistory from '../src/history/createHashHistory'
import { createLocation } from '../src/history/LocationUtils';

jest.mock('../src/history/createHashHistory')

fdescribe('router component', () => {
  let mockHistory

  beforeEach(() => {
    mockHistory = createHistory()
  })

  it('should ', () => {
    const ctn = document.createElement('div')
    // const spy = jest.fn()
    const url1 = '/pages/index/index'
    const url2 = '/pages/about/index'

    class Page extends Component {
      render () {}
    }

    class RouterComponent extends Component {
      render () {
        return (
          <Router
            history={mockHistory}
            routes={[{
              path: url1,
              component: Page,
              isIndex: true
            }, {
              path: url2,
              component: Page,
              isIndex: false
            }]}
          />
        )
      }
    }

    Nerv.render(<RouterComponent />, ctn)

    (history as any).notify({
      fromLocation: mockHistory.location,
      toLocation: createLocation(url2, '1', mockHistory.location),
      action: 'PUSH'
    })

  })

  it('should be able to get $router property via this', () => {
    
  });
})
