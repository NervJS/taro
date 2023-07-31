import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * WXML
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'createSelectorQuery',
                func: () => {
                    console.log('createSelectorQuery success ' , Taro.createSelectorQuery())
                },
            }, 
            {
                id: 'NodesRef',
                func: () => {
                    Taro.createSelectorQuery().select('#the-id').boundingClientRect(function(rect){
                        // rect.id      // 节点的ID
                        // rect.dataset // 节点的dataset
                        // rect.left    // 节点的左边界坐标
                        // rect.right   // 节点的右边界坐标
                        // rect.top     // 节点的上边界坐标
                        // rect.bottom  // 节点的下边界坐标
                        // rect.width   // 节点的宽度
                        // rect.height  // 节点的高度
                        console.log('boundingClientRect ', rect)
                    }).exec()
                    Taro.createSelectorQuery().select('.the-video-class').context(function (res) {
                        console.log('context ', res.context) // 节点对应的 Context 对象。如：选中的节点是 <video> 组件，那么此处即返回 VideoContext 对象
                    }).exec()
                    Taro.createSelectorQuery().select('#the-id').fields({
                        dataset: true,
                        size: true,
                        scrollOffset: true,
                        properties: ['scrollX', 'scrollY'],
                        computedStyle: ['margin', 'backgroundColor'],
                        context: true,
                      }, function (res) {
                        res.dataset    // 节点的dataset
                        res.width      // 节点的宽度
                        res.height     // 节点的高度
                        res.scrollLeft // 节点的水平滚动位置
                        res.scrollTop  // 节点的竖直滚动位置
                        res.scrollX    // 节点 scroll-x 属性的当前值
                        res.scrollY    // 节点 scroll-y 属性的当前值
                        // 此处返回指定要返回的样式名
                        res.margin
                        res.backgroundColor
                        res.context    // 节点对应的 Context 对象
                        console.log('fields ', res)
                        Taro.createSelectorQuery().select('.canvas').node(function(res){
                            console.log('node', res.node) // 节点对应的 Canvas 实例。
                          }).exec()
                        Taro.createSelectorQuery().selectViewport().scrollOffset(function(res){
                            res.id      // 节点的ID
                            res.dataset // 节点的dataset
                            res.scrollLeft // 节点的水平滚动位置
                            res.scrollTop  // 节点的竖直滚动位置
                            console.log('scrollOffset ', res)
                        }).exec()
                      }).exec()
                },
            }, 
            {
                id: 'SelectorQuery',
                func: () => {
                    const query = Taro.createSelectorQuery().in(this)
                    console.log('SelectorQuery in ', query)

                    Taro.createSelectorQuery().select('#the-id').fields({
                        dataset: true,
                        size: true,
                        scrollOffset: true,
                        properties: ['scrollX', 'scrollY']
                      }, function (res){
                        res.dataset    // 节点的dataset
                        res.width      // 节点的宽度
                        res.height     // 节点的高度
                        res.scrollLeft // 节点的水平滚动位置
                        res.scrollTop  // 节点的竖直滚动位置
                        res.scrollX    // 节点 scroll-x 属性的当前值
                        res.scrollY    // 节点 scroll-x 属性的当前值
                        console.log('SelectorQuery select ', res)
                      }).exec()
                    Taro.createSelectorQuery().selectViewport().scrollOffset(function (res) {
                        res.id      // 节点的ID
                        res.dataset // 节点的dataset
                        res.scrollLeft // 节点的水平滚动位置
                        res.scrollTop  // 节点的竖直滚动位置
                        console.log('SelectorQuery selectViewport ', res)
                    }).exec()
                },
            },
        ], 
    }
    render () {
        return (
            <View className='api-page'>
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
