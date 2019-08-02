import { isFunction } from './util'
import { shallowEqual } from '@tarojs/utils'

export function memo (component, propsAreEqual) {
  component.prototype.shouldComponentUpdate = function (nextProps) {
    return isFunction(propsAreEqual) ? !propsAreEqual(this.props, nextProps) : !shallowEqual(this.props, nextProps)
  }

  return component
}
