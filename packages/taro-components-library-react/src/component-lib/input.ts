import React from 'react'

import reactifyWc from './reactify-wc'

const Input = reactifyWc('taro-input-core')

const h = React.createElement

// eslint-disable-next-line react/display-name
export default React.forwardRef((props, ref) => {
  const args: Record<string, unknown> = { ...props }

  if (args.hasOwnProperty('focus')) {
    args.autoFocus = Boolean(args.focus)
    delete args.focus
  }

  return (
    h(Input, { ...args, ref })
  )
})
