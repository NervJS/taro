import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 框架
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: '触发 onError',
        func: () => {
          TestConsole.consoleTest('触发App.onError')
          throw new Error('')
        },
      },
      {
        id: '获得 onError&onPageNotFound 回调',
        func: () => {
          const onPageNotFoundCallback = Taro.getStorageSync('onPageNotFound')
          const onErrorCallback = Taro.getStorageSync('onError')
          const { lifeCycleCallback } = this.state
          if (onPageNotFoundCallback) {
            lifeCycleCallback['onPageNotFound'] = { onPageNotFound: onPageNotFoundCallback }
          }
          if (onErrorCallback) {
            lifeCycleCallback['onError'] = { onError: onErrorCallback }
          }
          this.setState({
            lifeCycleCallback,
          })
          Taro.showToast({
            title: '获得成功',
          })
        },
      },
      {
        id: 'getApp',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.getApp')
          TestConsole.consoleResult.call(this, Taro.getApp(), apiIndex)
        },
      },
      {
        id: 'getCurrentPages',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.getCurrentPages')
          TestConsole.consoleResult.call(this, Taro.getCurrentPages(), apiIndex)
        },
      },
      {
        id: 'Page',
        func: () => {
          TestConsole.consoleTest('Taro.getCurrentInstance().page')
          TestConsole.consoleNormal('当前页面信息', Taro.getCurrentInstance().page)
        },
      },
      {
        id: 'Page.componentDidHide',
        func: () => {
          TestConsole.consoleTest('Page.componentDidHide')
          Taro.navigateTo({
            url: '/pages/api/interface/interaction/index',
          })
        },
      },
    ],
    lifeCycleList: [
      'onError',
      'onLaunch',
      'onPageNotFound',
      'onTabItemTap',
      'onLoad',
      'onReady',
      'onPullDownRefresh',
      'onPageScroll',
      'onResize',
      'onReachBottom',
      'componentDidShow',
      'componentDidHide',
    ],
    lifeCycleCallback: {},
  }

  onLoad(res) {
    const onLaunchCallback = Taro.getStorageSync('onLaunch')
    const onTabItemTapCallback = Taro.getStorageSync('onTabItemTap')
    const { lifeCycleCallback } = this.state
    if (onLaunchCallback) {
      lifeCycleCallback['onLaunch'] = { onLaunch: onLaunchCallback }
    }
    if (onTabItemTapCallback) {
      lifeCycleCallback['onTabItemTap'] = { onTabItemTap: onTabItemTapCallback }
    }
    this.setState({
      lifeCycleCallback,
    })
    this.lifeCycleTrigger('onLoad', res)
  }

  onUnload(res) {
    this.lifeCycleTrigger('onUnload', res)
  }

  onReady(res) {
    this.lifeCycleTrigger('onReady', res)
  }

  componentDidShow(res) {
    this.lifeCycleTrigger('componentDidShow', res)
  }

  componentDidHide(res) {
    this.lifeCycleTrigger('componentDidHide', res)
  }

  onPullDownRefresh(res) {
    Taro.showModal({
      title: 'onPullDownRefresh',
      showCancel: false,
      success: () => {
        Taro.stopPullDownRefresh()
      },
    })
    this.lifeCycleTrigger('onPullDownRefresh', res)
  }

  onReachBottom(res) {
    Taro.showToast({
      title: 'onReachBottom',
    })
    this.lifeCycleTrigger('onReachBottom', res)
  }

  onPageScroll(res) {
    this.lifeCycleTrigger('onPageScroll', res)
  }

  onResize(res) {
    this.lifeCycleTrigger('onResize', res)
  }

  lifeCycleTrigger(lifeCycleName, res) {
    TestConsole.consoleTest(lifeCycleName)
    const { lifeCycleCallback } = this.state
    if (res) {
      lifeCycleCallback[lifeCycleName] = { [lifeCycleName]: res }
    } else {
      lifeCycleCallback[lifeCycleName] = { [lifeCycleName]: 'triggered' }
    }
    this.setState({
      lifeCycleCallback,
    })
    TestConsole.consoleNormal(lifeCycleName, res)
  }

  render() {
    const { list, lifeCycleList, lifeCycleCallback } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
        {lifeCycleList.map((lifeCycle) => {
          if (lifeCycleCallback[lifeCycle]) {
            return (
              <View id={lifeCycle} className='callback-content'>
                {JSON.stringify(lifeCycleCallback[lifeCycle])}
              </View>
            )
          }
        })}
        <View style={{ height: '1000px', textAlign: 'center', border: '1px solid #000' }}>填充区域，可以滚动屏幕</View>
      </View>
    )
  }
}
