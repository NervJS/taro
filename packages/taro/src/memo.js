import { isFunction, objectIs } from './util'

export function memo (component, propsAreEqual) {
  component.prototype.shouldComponentUpdate = function (nextProps) {
    return isFunction(propsAreEqual) ? !propsAreEqual(this.props, nextProps) : !objectIs(this.props, nextProps)
  }

  return component
}
