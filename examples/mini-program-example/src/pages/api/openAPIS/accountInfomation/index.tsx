import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import './index.scss'

/**
 * 开放接口-账户信息
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        api: {
            id: 'getAccountInfoSync',
            func: null,
        }, 
    }
    render () {
        const { api, inputValue, disabled } = this.state;
        return (
            <View className='api-page'>
                <View>请在下方输入电话号码</View>
                <Input type="number" name="input" onInput={this.changeNumber} />
                <Button
                    className='api-page-btn'
                    type='primary'
                    onClick={disabled ? () => {
                        Taro.showToast({
                            title: '请输入手机号码',
                            icon: 'error',
                        })
                    } : () => {api.func(inputValue)}}
                >
                    {api.id}
                    {
                        api.func == null && (<Text className='navigator-state tag'>未创建Demo</Text>)
                    }
                </Button>
            </View>
        )
    }
}
