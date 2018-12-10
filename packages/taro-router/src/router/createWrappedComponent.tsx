import { tryToCall } from '../utils/index'
import * as Types from '../utils/types'

const createWrappedComponent = (component: Types.PageComponent) => {
  class WrappedComponent extends component {
    constructor (props, context) {
      super(props, context)

      const originalComponentDidShow = this.componentDidShow
      const config = this['config'] || {}
      let navigationBarTitleText = config.navigationBarTitleText
      const newComponentDidShow = () => {
        tryToCall(originalComponentDidShow, this)
        if (navigationBarTitleText) {
          document.title = navigationBarTitleText
        }
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
