export { Component, createElement } from 'nervjs'
const EMPTY_ARRAY = []
const isArray = Array.isArray
export const Children = {
  only (children) {
    children = Children.toArray(children)
    if (children.length !== 1) {
      throw new Error('Provider expects only one child.')
    }
    return children[0]
  },

  toArray (children) {
    if (children === null || children === void 0) {
      return []
    }
    return isArray(children) ? children : EMPTY_ARRAY.concat(children)
  }
}
