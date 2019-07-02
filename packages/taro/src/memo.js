import { isFunction, objectIs } from './util'

export function memo (component, propsAreEqual) {
  component.prototype.shouldComponentUpdate = function (nextProps, nextState) {
    return (
      !objectIs(this.state, nextState) ||
      (isFunction(propsAreEqual) ? !propsAreEqual(this.props, nextProps) : !objectIs(this.props, nextProps))
    )
  }

  return component
}
