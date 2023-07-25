import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 界面-滚动
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'pageScrollTo',
                func: () => {
                    Taro.pageScrollTo({
                        scrollTop: 4,
                        duration: 300,
                        selector: '',//css selector
                        offsetTop: 0,
                        success: (res) => {
                            console.log('pageScrollTo success ', res)
                        },
                        fail: (res) => {
                            console.log('pageScrollTo fail ', res)
                        },
                        complete: (res) => {
                            console.log('pageScrollTo complete ', res)
                        },
                    })
                },
            }, 
            {
                id: 'ScrollViewContext',
                func: null,
            }, 
        ], 
    }
    render () {
        return (
            <View className='api-page'>
                {
                    this.state.list.map((item) => {
                        return (
                            <Button
                                className='api-page-btn'
                                type='primary'
                                onClick={item.func == null ? () => {} : item.func}
                            >
                                {item.id}
                                {
                                    item.func == null && (<Text className='navigator-state tag'>未创建Demo</Text>)
                                }
                            </Button>
                        )
                    })
                }
            </View>
        )
    }
}
