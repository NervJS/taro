import { Children } from 'nervjs'
import { Component } from '@tarojs/taro-h5'
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
