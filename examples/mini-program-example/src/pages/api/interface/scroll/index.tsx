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
                    console.log('pageScrollTo')
                    Taro.pageScrollTo({
                        duration: 300,
                        selector: '#content',
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
        listTail: [
            {
                id: 'pageScrollTo: 滚到顶部',
                func: () => {
                    console.log('pageScrollTo')
                    Taro.pageScrollTo({
                        scrollTop: 0,
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
        ]
    }
    render () {
        return (
            <View className='api-page'>
                {
                    this.state.list.map((item) => {
                        return (
                            <Button
                                key={item.id}
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
                {
                    <Button
                        id='content'
                        style={{height: 1200, backgroundColor: '#FFFFFE'}}
                    >空白视图，用于滚动测试</Button>
                }
                {
                    this.state.listTail.map((item) => {
                        return (
                            <Button
                                key={item.id}
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
