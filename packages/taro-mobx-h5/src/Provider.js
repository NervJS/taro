import { Children } from 'nervjs'
import Taro from '@tarojs/taro-h5'
import { setStore } from '@tarojs/mobx-common'

export default class Provider extends Taro.Component {
  constructor (props) {
    super(props)
    setStore(props.store)
  }

  render () {
    return Children.only(this.props.children)
  }
}
