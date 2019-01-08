import { Children } from 'react'
import { Component } from '@tarojs/taro-rn'
import { setStore } from '@tarojs/mobx-common'

export default class Provider extends Component {
  constructor (props) {
    super(props)
    setStore(props.store)
  }

  render () {
    return Children.only(this.props.children)
  }
}
