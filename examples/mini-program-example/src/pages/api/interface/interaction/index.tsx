import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 界面-交互
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'showToast',
        func: (apiIndex) => {
          Taro.showToast({
            title: 'test showToast',
            icon: 'success',
            duration: 2000,
            mask: false,
            image: '',
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'showModal',
        func: (apiIndex) => {
          Taro.showModal({
            title: '提示',
            content: '这是一个模态弹窗',
            cancelColor: '#ff0000', //red
            cancelText: '取消按钮',
            confirmColor: '#00ff00', //green
            confirmText: '确认按钮',
            showCancel: true,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'showLoading',
        func: (apiIndex) => {
          Taro.showLoading({
            title: '加载中',
            mask: true,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'showActionSheet',
        func: (apiIndex) => {
          Taro.showActionSheet({
            alertText: '警示文案',
            itemList: ['A', 'B', 'C'],
            itemColor: '#00FF00',
            success: (res) => {
              Taro.showToast({
                title: `选择项目：${res.tapIndex}`,
                icon: 'success',
              })
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              Taro.showToast({
                title: `失败：${res.errMsg}`,
                icon: 'error',
              })
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'hideToast',
        func: (apiIndex) => {
          Taro.showToast({
            title: 'test hideToast',
            icon: 'success',
            duration: 2000,
            mask: false,
            image: '',
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
          setTimeout(function () {
            Taro.hideToast({
              noConflict: false,
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
          }, 2000)
        },
      },
      {
        id: 'hideLoading',
        func: (apiIndex) => {
          Taro.showLoading({
            title: '加载中',
            mask: true,
          })
          setTimeout(function () {
            Taro.hideLoading({
              noConflict: false,
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
          }, 2000)
        },
      },
      {
        id: 'enableAlertBeforeUnload',
        func: null,
      },
      {
        id: 'disableAlertBeforeUnload',
        func: null,
      },
    ],
  }
  render() {
    return (
      <View className='api-page'>
        {this.state.list.map((item) => {
          return (
            <View key={item.id} className='api-page-btn' onClick={item.func == null ? () => {} : item.func}>
              <Text>{item.id}</Text>
              {item.func == null && <Text className='navigator-state tag'>未创建Demo</Text>}
            </View>
          )
        })}
      </View>
    )
  }
}
