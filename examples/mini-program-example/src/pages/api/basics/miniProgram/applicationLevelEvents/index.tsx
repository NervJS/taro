import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'

/**
 * 基础-应用级事件
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'onUnhandledRejection',
        func: () =>{
          TestConsole.consoleTest('Taro.onUnhandledRejection')
          new Promise((resolve,reject)=>{
            const aa = 'name';
            // @ts-ignore
            if (aa === 'name1') {
              resolve(aa);
            } else {
              reject({message: 'error'});
            }
          })

          Taro.onUnhandledRejection((res)=>{
            TestConsole.consoleSuccess('Taro.onUnhandledRejection'+JSON.stringify(res))
          })
        },
      }, 
      {
        id: 'onThemeChange',
        func: () =>{
          TestConsole.consoleTest('Taro.onThemeChange')
          Taro.onThemeChange((res) =>{
          TestConsole.consoleSuccess('Taro.onThemeChange'+JSON.stringify(res))
          })
        },
      }, 
      {
        id: 'onPageNotFound',
        func: ()=>{
          TestConsole.consoleTest('Taro.onPageNotFound')
          Taro.navigateTo({
            url:'pages/api/index/11'
          })
          Taro.onPageNotFound((res)=>{
            TestConsole.consoleSuccess('Taro.onPageNotFound'+JSON.stringify(res))
              Taro.navigateTo({
                url:'pages/api/index/index'
              })
          })
        },
      }, 
      {
        id: 'onError',
        func: () =>{
          TestConsole.consoleTest('Taro.onError')
          Taro.onError((err)=>{
            TestConsole.consoleSuccess('Taro.onError'+JSON.stringify(err))
          })
        },
      }, 
      {
        id: 'onAudioInterruptionEnd',
        func: () => {
          TestConsole.consoleTest('Taro.onAudioInterruptionEnd')
          Taro.onAudioInterruptionEnd((_result) => {
            TestConsole.consoleSuccess('Taro.onAudioInterruptionEnd'+JSON.stringify(_result))
          })

        },
      }, 
      {
        id: 'onAudioInterruptionBegin',
        func: () => {
          TestConsole.consoleTest('Taro.onAudioInterruptionBegin')
          Taro.onAudioInterruptionBegin((_result) => {
            TestConsole.consoleSuccess('Taro.onAudioInterruptionBegin'+JSON.stringify(_result))
          })

        },
      }, 
      {
        id: 'onAppShow',
        func: () => {
          TestConsole.consoleTest('Taro.onAppShow')
          Taro.onAppShow((_result) => {
            TestConsole.consoleSuccess('Taro.onAppShow'+JSON.stringify(_result))
          })

        },
      }, 
      {
        id: 'onAppHide',
        func: () => {
          TestConsole.consoleTest('Taro.onAppHide')
          Taro.onAppHide((_result) => {
            TestConsole.consoleSuccess('Taro.onAppHide'+JSON.stringify(_result))
          })
        },
      }, 
      {
        id: 'offThemeChange',
        func: () => {
          TestConsole.consoleTest('Taro.offThemeChange')
          Taro.offThemeChange((_result) => {
            TestConsole.consoleSuccess('Taro.offThemeChange'+JSON.stringify(_result))
          })
        },
      }, 
      {
        id: 'offPageNotFound',
        func: () =>{
          TestConsole.consoleTest('Taro.offPageNotFound')
          Taro.offPageNotFound((res)=>{
            TestConsole.consoleSuccess('Taro.offPageNotFound'+JSON.stringify(res))
          })
          Taro.navigateTo({
            url:'pages/api/index/11'
          })
        },
      }, 
      {
        id: 'offError',
        func: () =>{
          TestConsole.consoleTest('Taro.offError')
          Taro.offError((_result) => {
            TestConsole.consoleSuccess('Taro.offError'+JSON.stringify(_result))
          })
        },
      }, 
      {
        id: 'offAudioInterruptionEnd',
        func: () =>{
          TestConsole.consoleTest('Taro.offAudioInterruptionEnd')
          Taro.offAudioInterruptionEnd((_result) => {
            TestConsole.consoleSuccess('Taro.offAudioInterruptionEnd'+JSON.stringify(_result))
          })
        },
      }, 
      {
        id: 'offAudioInterruptionBegin',
        func: () =>{
          TestConsole.consoleTest('Taro.offAudioInterruptionBegin')
          Taro.offAudioInterruptionBegin((_result) => {
            TestConsole.consoleSuccess('Taro.offAudioInterruptionBegin'+JSON.stringify(_result))
          })
        },
      }, 
      {
        id: 'offAppShow',
        func: () =>{
          TestConsole.consoleTest('Taro.offAppShow')
          Taro.offAppShow((_result) => {
            TestConsole.consoleSuccess('Taro.offAppShow'+JSON.stringify(_result))
          })
        },
      }, 
      {
        id: 'offAppHide',
        func: () =>{
          TestConsole.consoleTest('Taro.offAppHide')
          Taro.offAppHide((_result) => {
            TestConsole.consoleSuccess('Taro.offAppHide'+JSON.stringify(_result))
          })
        },
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
