
import * as assert from 'assert'
import React from 'react'
import ReactDOM from 'react-dom'
import simulant from 'simulant'
import * as sinon from 'sinon'

import { PickerView, PickerViewColumn, View } from '../h5/react'
import { waitForChange } from './utils'

const h = React.createElement

describe('PickerView', () => {
  /**
   * @type {HTMLElement}
   */
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  afterEach(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('props valid', async () => {
    // const onChange = sinon.spy()
    const domRef = React.createRef()

    const onChangeValue = sinon.spy()

    class App extends React.Component {
      constructor () {
        super(...arguments)
        const date = new Date()
        const years = []
        for (let i = 1990; i <= date.getFullYear(); i++) {
          years.push(i)
        }
        this.state = {
          years: years,
          year: date.getFullYear(),
          value: [20, 0, 0]
        }
      }

      render () {
        return (
          <View>
            <View>{this.state.year}年{this.state.month}月{this.state.day}日</View>
            <PickerView
              ref={domRef}
              indicatorStyle='height: 60px;'
              indicatorClass='test_indicatorClass'
              style='width: 100%; height: 300px; position: absolute; bottom: 0px;'
              value={this.state.value}
              onChange={(e) => {
                onChangeValue(e)
              }}
              // onPickStart={this.onPickStart}
              maskClass='test_maskClass'
              maskStyle="background-color: rgba(33, 33, 33, 0.5);"
              onPickEnd={this.onPickEnd} >
              <PickerViewColumn>
                {this.state.years.map(item => {
                  return (
                    <View style='height: 60px; line-height: 60px; text-align: center;' key={item}>{item}年</View>
                  )
                })}
              </PickerViewColumn>
            </PickerView>
          </View>
        )
      }
    }

    ReactDOM.render(<App />, scratch)

    const node = domRef.current

    await waitForChange(node)

    const indicatorEle = document.querySelector('.taro-picker-view-mask-indicator')
    const indicatorEleClassName = indicatorEle.className

    assert(indicatorEleClassName.indexOf('test_indicatorClass') > -1)

    const maskTopEle = document.querySelector('.taro-picker-view-mask-top')
    const maskTopEleClassName = maskTopEle.className
    assert(maskTopEleClassName.indexOf('test_maskClass') > -1)

    const maskBottomEle = document.querySelector('.taro-picker-view-mask-bottom')
    const maskBottomEleClassName = maskBottomEle.className
    assert(maskBottomEleClassName.indexOf('test_maskClass') > -1)

    const pickerViewColumnEle = document.querySelector('.taro-picker-view-column-container')

    // 模拟滑动
    const startY = 0
    const endY = 200

    simulant.fire(pickerViewColumnEle, 'mousedown', new MouseEvent(pickerViewColumnEle, { clientY: startY }))

    simulant.fire(pickerViewColumnEle, 'mousemove', new MouseEvent(pickerViewColumnEle, { clientY: endY }))
  })
})
