import { tryToCall } from '../utils/index'
import * as Types from '../utils/types'
import { Component } from '@tarojs/taro-h5';

const createWrappedComponent = (component: Types.PageComponent) => {
  class WrappedComponent extends component {
    config: { [key: string]: any };
    wrappedInstance: Component<any, any>;

    constructor (props, context) {
      super(props, context)

      const originalComponentDidShow = this.componentDidShow
      const newComponentDidShow = function () {
        const { navigationBarTitleText } = this.config || { navigationBarTitleText: null }
        if (navigationBarTitleText) {
          document.title = navigationBarTitleText
        }
        tryToCall(originalComponentDidShow, this)
      }
      this.componentDidShow = newComponentDidShow
    }

    componentDidMount () {
      const superComponentDidMount = super.componentDidMount      
      
      tryToCall(superComponentDidMount, this)
      tryToCall(this.componentDidShow, this)
    }

    componentWillUnmount () {
      let componentDidHide = this.componentDidHide
      let superComponentWillUnmount = super.componentWillUnmount

      tryToCall(superComponentWillUnmount, this)
      tryToCall(componentDidHide, this)
    }
  }
  return WrappedComponent
}

export default createWrappedComponent
