import { document } from '@tarojs/runtime'
import * as React from 'react'

import { render } from '../dist/react.esm'

describe('Context', () => {
  beforeAll(() => {
    process.env.FRAMEWORK = 'react'
  })

  afterAll(() => {
    process.env.FRAMEWORK = undefined
  })

  it('Context must be available in the consumer', () => {
    let actual = 0
    const Context = React.createContext()

    function Consumer () {
      return (
        <Context.Consumer>
          {value => {
            actual = value
            return <text prop={'Result: ' + value} />
          }}
        </Context.Consumer>
      )
    }

    class MyNode extends React.Component {
      render () {
        return (
          <view>
            <text>Noise</text>
            <Consumer />
          </view>
        )
      }
    }

    const container = document.createElement('view')
    render(
      <Context.Provider value={5}>
        <MyNode />
      </Context.Provider>,
      container,
      function () {
        expect(actual).toBe(5)
      }
    )
  })
})
