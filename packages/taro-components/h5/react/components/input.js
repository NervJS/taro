import React from 'react'
import reactifyWc from '../utils/reactify-wc'
const Input = reactifyWc('taro-input-core')

// eslint-disable-next-line
const h = React.createElement

export default React.forwardRef((props, ref) => {
  const args = { ...props }

  if (args.hasOwnProperty('focus')) {
    args.autoFocus = Boolean(args.focus)
    delete args.focus
  }

  return (
    React.createElement(Input, { ...args, ref: ref })
  )
})
