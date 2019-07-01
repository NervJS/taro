import { isFunction, objectIs } from './util'

export function memo (component, propsAreEqual) {
  component.prototype.shouldComponentUpdate = function (nextProps, nextState) {
    return (
      (isFunction(propsAreEqual) ? !propsAreEqual(this.props, nextProps) : !objectIs(this.props, nextProps)) &&
      !objectIs(this.state, nextState)
    )
  }

  return component
}
