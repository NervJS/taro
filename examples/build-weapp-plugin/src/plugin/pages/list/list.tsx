import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import ListItem from '../../components/listItem/listItem'
import './list.scss'

declare const requireMiniProgram: () => { whoami: string }

export default class Index extends Component<any, any> {
  state = {
    list: [{
      name: 'A',
      value: '1'
    }, {
      name: 'B',
      value: '2'
    }, {
      name: 'C',
      value: '3'
    }]
  }

  componentDidMount () {
    // 测试 export 京东小程序不支持在插件侧调用
    // console.log(requireMiniProgram().whoami)
  }

  onShareAppMessage() {
    return {
      title: '测试分享',
      path: '/pages/index/index'
    }
  }

  getElement = () => {
    const query = Taro.createSelectorQuery().in(this.props.$scope)
    query.select('.page').boundingClientRect().exec(res => {
      console.log(res)
    })
  }

  render () {
    return (
      <View className='page'>
        <View>
          {this.state.list.map(item => {
            return <ListItem name={item.name} value={item.value} key={item.name} />
          })}
        </View>

        <Button onClick={this.getElement}>测试元素获取</Button>

        <mp-comp></mp-comp>
      </View>
    )
  }
}
