import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'
import { TestConsole } from '@/util/util'
import apiImage from '@/assets/tab/api.png'
import apiSelectImage from '@/assets/tab/api_select.png'

/**
 * 界面-Tab Bar
 * @returns
 */
interface Props {
  backToAPI: any
}

export default class Index extends React.Component<Props> {
  state = {
    list: [
      {
        id: 'showTabBarRedDot',
        func: (apiIndex) => {
          TestConsole.consoleTest('showTabBarRedDot')
          Taro.showTabBarRedDot({
            index: 0,
            success: (res) => {
              Taro.showToast({
                title: '显示tab红点',
                icon: 'success',
                duration: 3000,
              })
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
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
        id: 'hideTabBarRedDot',
        func: (apiIndex) => {
          TestConsole.consoleTest('hideTabBarRedDot')
          Taro.hideTabBarRedDot({
            index: 0,
            success: (res) => {
              Taro.showToast({
                title: '隐藏tab红点',
                icon: 'success',
                duration: 3000,
              })
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
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
        id: 'hideTabBar',
        func: (apiIndex) => {
          TestConsole.consoleTest('hideTabBar')
          Taro.hideTabBar({
            animation: true,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              Taro.showToast({
                title: '隐藏tabBar',
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'showTabBar',
        func: (apiIndex) => {
          TestConsole.consoleTest('showTabBar')
          Taro.showTabBar({
            animation: true,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              Taro.showToast({
                title: '显示tabBar',
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'setTabBarStyle',
        func: (apiIndex) => {
          TestConsole.consoleTest('setTabBarStyle')
          Taro.setTabBarStyle({
            color: '#1F69FF',
            selectedColor: '#F7F7F7',
            backgroundColor: '#7A7E83',
            borderStyle: 'white',
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              Taro.showToast({
                title: '设置tabBar样式',
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'setTabBarStyle: 恢复初始',
        func: (apiIndex) => {
          TestConsole.consoleTest('setTabBarStyle: 恢复初始')
          Taro.setTabBarStyle({
            color: '#7A7E83',
            selectedColor: '#1F69FF',
            borderStyle: 'black',
            backgroundColor: '#F7F7F7',
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              Taro.showToast({
                title: '恢复tabBar样式',
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'setTabBarItem',
        func: (apiIndex) => {
          TestConsole.consoleTest('setTabBarItem')
          Taro.setTabBarItem({
            index: 2,
            text: 'API',
            selectedIconPath: apiImage,
            iconPath: apiSelectImage,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              Taro.showToast({
                title: '设置tabBar内容',
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'setTabBarItem: 恢复初始',
        func: (apiIndex) => {
          TestConsole.consoleTest('setTabBarItem: 恢复初始')
          Taro.setTabBarItem({
            index: 2,
            text: '接口',
            selectedIconPath: apiSelectImage,
            iconPath: apiImage,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              Taro.showToast({
                title: '恢复tabBar内容',
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'setTabBarBadge',
        inputData: {
          index: 1,
          text: '3',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('setTabBarBadge')
          Taro.setTabBarBadge({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              Taro.showToast({
                title: '添加tabBar文本',
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'removeTabBarBadge',
        func: (apiIndex) => {
          TestConsole.consoleTest('removeTabBarBadge')
          Taro.removeTabBarBadge({
            index: 1,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              Taro.showToast({
                title: '移除tabBar文本',
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
    ],
  }
  backToAPI = () => {
    this.props.backToAPI()
  }
  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        <View className='back-btn' onClick={this.backToAPI}>
          返回上一级
        </View>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
