import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import apiImage from '@/assets/tab/api.png'
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
        inputData: {
          title: 'showToast',
          duration: 2000,
          icon: 'success',
          image: apiImage,
          mask: true,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('showToast')
          Taro.showToast({
            ...data,
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
        inputData: {
          title: '提示',
          content: '这是一个模态弹窗',
          showCancel: true,
          cancelColor: '#f00',
          cancelText: '取消',
          confirmColor: '#0f0',
          confirmText: '确认',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('showModal')
          Taro.showModal({
            ...data,
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
        inputData: {
          title: '加载中',
          mask: true,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('showLoading')
          Taro.showLoading({
            ...data,
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
        inputData: {
          alertText: '警示文案',
          itemList: ['ActionA', 'ActionB', 'ActionC'],
          itemColor: '#0f0',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('showActionSheet')
          Taro.showActionSheet({
            ...data,
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
        inputData: {
          noConflict: false,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('showToast->hideToast')
          Taro.showToast({
            title: 'hideToast',
            duration: 5000,
          })
          setTimeout(() => {
            Taro.hideToast({
              ...data,
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
        id: 'hideToast1',
        inputData: {
          noConflict: false,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('showLoading->hideToast')
          Taro.showLoading({
            title: 'hideToast',
          })
          setTimeout(() => {
            Taro.hideToast({
              ...data,
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
        inputData: {
          noConflict: false,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('showLoading->hideLoading')
          Taro.showLoading({
            title: 'hideLoading',
          })
          setTimeout(() => {
            Taro.hideLoading({
              ...data,
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
        id: 'hideLoading2',
        inputData: {
          noConflict: false,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('showToast->hideLoading')
          Taro.showToast({
            title: 'hideLoading',
            duration: 5000,
          })
          setTimeout(() => {
            Taro.hideLoading({
              ...data,
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
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
