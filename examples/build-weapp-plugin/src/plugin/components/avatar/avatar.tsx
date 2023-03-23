import React, { Component } from 'react'
import { View, Image } from '@tarojs/components'
import './avatar.scss'

export default class Avatar extends Component<{ mode: any, onAvatarClick: any }, null> {
  node: { ctx: any }
  handleClick () {
    this.node.ctx.triggerEvent('avatarClick')
  }

  render () {
    return (
      <View ref={node => this.node = node} >
        <Image
          className='logo'
          src='http://storage.360buyimg.com/taro-static/static/images/logo.png'
          mode={this.props.mode}
        />
        <Child onClick={this.handleClick.bind(this)} />
      </View>
    )
  }
}

class Child extends Component<{ onClick: any }> {
  render () {
    return (
      <View onClick={this.props.onClick}>
        Child
      </View>
    )
  }
}
