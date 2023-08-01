import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'
import apiImage from '../../../../assets/tab/api.png'
import apiSelectImage from '../../../../assets/tab/api_select.png'

/**
 * 界面-Tab Bar
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'showTabBarRedDot',
        func: function () {
          console.log('showTabBarRedDot')
          Taro.showTabBarRedDot({
            index: 0,
            success: (res) => {
              console.log('showTabBarRedDot success ', res)
              Taro.showToast({
                title: `请到主页看效果`,
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              console.error('showTabBarRedDot fail ', res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              console.log('showTabBarRedDot complete ', res)
            },
          })
        },
      },
      {
        id: 'hideTabBarRedDot',
        func: function () {
          console.log('hideTabBarRedDot')
          Taro.hideTabBarRedDot({
            index: 0,
            success: (res) => {
              console.log('hideTabBarRedDot success ', res)
              Taro.showToast({
                title: `请到主页看效果`,
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              console.error('hideTabBarRedDot fail ', res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              console.log('hideTabBarRedDot complete ', res)
            },
          })
        },
      },
      {
        id: 'hideTabBar',
        func: function () {
          console.log('hideTabBar')
          Taro.hideTabBar({
            animation: true,
            success: (res) => {
              console.log('hideTabBar success ', res)
              Taro.showToast({
                title: `请到主页看效果`,
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              console.error('hideTabBar fail ', res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              console.log('hideTabBar complete ', res)
            },
          })
        },
      },
      {
        id: 'showTabBar',
        func: function () {
          console.log('showTabBar')
          Taro.showTabBar({
            animation: true,
            success: (res) => {
              console.log('showTabBar success ', res)
              Taro.showToast({
                title: `请到主页看效果`,
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              console.error('showTabBar fail ', res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              console.log('showTabBar complete ', res)
            },
          })
        },
      },
      {
        id: 'setTabBarStyle',
        func: function () {
          console.log('setTabBarStyle')
          Taro.setTabBarStyle({
            color: '#FF0000',
            selectedColor: '#00FF00',
            backgroundColor: '#0000FF',
            borderStyle: 'white',
            success: (res) => {
              console.log('setTabBarStyle success ', res)
              Taro.showToast({
                title: `请到主页看效果`,
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              console.error('setTabBarStyle fail ', res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              console.log('setTabBarStyle complete ', res)
            },
          })
        },
      },
      {
        id: 'setTabBarStyle: 恢复初始',
        func: function () {
          console.log('setTabBarStyle')
          Taro.setTabBarStyle({
            color: '#7A7E83',
            selectedColor: '#1F69FF',
            borderStyle: 'black',
            backgroundColor: '#F7F7F7',
            success: (res) => {
              console.log('setTabBarStyle success ', res)
              Taro.showToast({
                title: `请到主页看效果`,
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              console.error('setTabBarStyle fail ', res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              console.log('setTabBarStyle complete ', res)
            },
          })
        },
      },
      {
        id: 'setTabBarItem',
        func: function () {
          console.log('setTabBarItem')
          Taro.setTabBarItem({
            index: 2,
            text: 'API',
            selectedIconPath: apiImage,
            iconPath: apiSelectImage,
            success: (res) => {
              console.log('setTabBarItem success ', res)
              Taro.showToast({
                title: `请到主页看效果`,
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              console.error('setTabBarItem fail ', res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              console.log('setTabBarItem complete ', res)
            },
          })
        },
      },
      {
        id: 'setTabBarItem: 恢复初始',
        func: function () {
          console.log('setTabBarItem')
          Taro.setTabBarItem({
            index: 2,
            text: '接口',
            selectedIconPath: apiSelectImage,
            iconPath: apiImage,
            success: (res) => {
              console.log('setTabBarItem success ', res)
              Taro.showToast({
                title: `请到主页看效果`,
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              console.error('setTabBarItem fail ', res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              console.log('setTabBarItem complete ', res)
            },
          })
        },
      },
      {
        id: 'setTabBarBadge',
        func: function () {
          console.log('setTabBarBadge')
          Taro.setTabBarBadge({
            index: 1,
            text: '2',
            success: (res) => {
              console.log('setTabBarBadge success ', res)
              Taro.showToast({
                title: `请到主页看效果`,
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              console.error('setTabBarBadge fail ', res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              console.log('setTabBarBadge complete ', res)
            },
          })
        },
      },
      {
        id: 'removeTabBarBadge',
        func: function () {
          console.log('removeTabBarBadge')
          Taro.removeTabBarBadge({
            index: 1,
            success: (res) => {
              console.log('removeTabBarBadge success ', res)
              Taro.showToast({
                title: `请到主页看效果`,
                icon: 'success',
                duration: 3000,
              })
            },
            fail: (res) => {
              console.error('removeTabBarBadge fail ', res)
              Taro.showToast({
                title: res.errMsg,
                icon: 'error',
                duration: 3000,
              })
            },
            complete: (res) => {
              console.log('removeTabBarBadge complete ', res)
            },
          })
        },
      },
    ],
  }
  render() {
    return (
      <View className='api-page'>
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
