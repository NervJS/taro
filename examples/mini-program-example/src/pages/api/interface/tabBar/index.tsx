import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
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
        func: function () {
          TestConsole.consoleTest('showTabBarRedDot')
          Taro.showTabBarRedDot({
            index: 0,
            success: (res) => {
              TestConsole.consoleSuccess(res)
              Taro.showToast({
                title: '显示tab红点',
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          })
        },
      },
      {
        id: 'hideTabBarRedDot',
        func: function () {
          TestConsole.consoleTest('hideTabBarRedDot')
          Taro.hideTabBarRedDot({
            index: 0,
            success: (res) => {
              TestConsole.consoleSuccess(res)
              Taro.showToast({
                title: '隐藏tab红点',
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          })
        },
      },
      {
        id: 'hideTabBar',
        func: function () {
          TestConsole.consoleTest('hideTabBar')
          Taro.hideTabBar({
            animation: true,
            success: (res) => {
              TestConsole.consoleSuccess(res)
              Taro.showToast({
                title: '隐藏tabBar',
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          })
        },
      },
      {
        id: 'showTabBar',
        func: function () {
          TestConsole.consoleTest('showTabBar')
          Taro.showTabBar({
            animation: true,
            success: (res) => {
              TestConsole.consoleSuccess(res)
              Taro.showToast({
                title: '显示tabBar',
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          })
        },
      },
      {
        id: 'setTabBarStyle',
        func: function () {
          TestConsole.consoleTest('setTabBarStyle')
          Taro.setTabBarStyle({
            color: '#1F69FF',
            selectedColor: '#F7F7F7',
            backgroundColor: '#7A7E83',
            borderStyle: 'white',
            success: (res) => {
              TestConsole.consoleSuccess(res)
              Taro.showToast({
                title: '设置tabBar样式',
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          })
        },
      },
      {
        id: 'setTabBarStyle: 恢复初始',
        func: function () {
          TestConsole.consoleTest('setTabBarStyle: 恢复初始')
          Taro.setTabBarStyle({
            color: '#7A7E83',
            selectedColor: '#1F69FF',
            borderStyle: 'black',
            backgroundColor: '#F7F7F7',
            success: (res) => {
              TestConsole.consoleSuccess(res)
              Taro.showToast({
                title: '恢复tabBar样式',
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          })
        },
      },
      {
        id: 'setTabBarItem',
        func: function () {
          TestConsole.consoleTest('setTabBarItem')
          Taro.setTabBarItem({
            index: 2,
            text: 'API',
            selectedIconPath: apiImage,
            iconPath: apiSelectImage,
            success: (res) => {
              TestConsole.consoleSuccess(res)
              Taro.showToast({
                title: '设置tabBar内容',
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          })
        },
      },
      {
        id: 'setTabBarItem: 恢复初始',
        func: function () {
          TestConsole.consoleTest('setTabBarItem: 恢复初始')
          Taro.setTabBarItem({
            index: 2,
            text: '接口',
            selectedIconPath: apiSelectImage,
            iconPath: apiImage,
            success: (res) => {
              TestConsole.consoleSuccess(res)
              Taro.showToast({
                title: '恢复tabBar内容',
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          })
        },
      },
      {
        id: 'setTabBarBadge',
        func: function () {
          TestConsole.consoleTest('setTabBarBadge')
          Taro.setTabBarBadge({
            index: 1,
            text: 'askudfglsajkf',
            success: (res) => {
              TestConsole.consoleSuccess(res)
              Taro.showToast({
                title: '添加tabBar文本',
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          })
        },
      },
      {
        id: 'removeTabBarBadge',
        func: function () {
          TestConsole.consoleTest('removeTabBarBadge')
          Taro.removeTabBarBadge({
            index: 1,
            success: (res) => {
              TestConsole.consoleSuccess(res)
              Taro.showToast({
                title: '移除tabBar文本',
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
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
    return (
      <View className='api-page'>
        <View className='api-page-btn back-btn' onClick={this.backToAPI}>
          返回上一级
        </View>
        {this.state.list.map((item) => {
          return (
            <View key={item.id} className='api-page-btn' onClick={item.func == null ? () => {} : item.func}>
              {item.id}
              {item.func == null && <Text className='navigator-state tag'>未创建Demo</Text>}
            </View>
          )
        })}
      </View>
    )
  }
}
