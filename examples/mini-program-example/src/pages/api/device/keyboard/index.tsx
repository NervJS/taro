import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import './index.scss'

/**
 * 设备-键盘
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'onKeyboardHeightChange',
                func: () => {
                    Taro.onKeyboardHeightChange(res => {
                        console.log('success-----', res.height)
                    })
                },
            }, 
            {
                id: 'offKeyboardHeightChange',
                func: () => {
                    Taro.offKeyboardHeightChange(res => {
                        console.log('success-----', res.height)
                    })
                },
            }, 
            {
                id: 'hideKeyboard',
                func: () => {
                    console.log('1111111')
                    Taro.hideKeyboard({
                        success: (res) => {
                          console.log('success-----', res)
                        }
                    })
                },
            }, 
            {
                id: 'getSelectedTextRange',
                func: () => {
                    console.log('1111111')
                    Taro.getSelectedTextRange({
                        success: (res) => {
                          console.log('success-----', res)
                        },
                        fail: (res) => {
                            console.log('fail-----', res)
                          }
                    })
                },
            }, 
        ], 
    }
    inputFocus = (e) => {
        this.state.list[3].func();
    }
    hideKeyboard = (e) => {
        let inputValue = e.detail.value + '';
        console.log(inputValue);
        if (inputValue == 'hide') {
            this.state.list[2].func();
        }
    }
    render () {
        return (
            <View className='api-page'>
                <View>点击输入框拉起键盘</View>
                <Input onFocus={this.inputFocus} onInput={this.hideKeyboard}></Input>
                {
                    this.state.list.map((item) => {
                        return (
                            <View
                                className='api-page-btn'
                                onClick={item.func == null ? () => {} : item.func}
                            >
                                {item.id}
                                {
                                    item.func == null && (<Text className='navigator-state tag'>未创建Demo</Text>)
                                }
                            </View>
                        )
                    })
                }
            </View>
        )
    }
}
