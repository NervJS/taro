import React from 'react'
import reactifyWc from '../utils/reactify-wc'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

const Input = reactifyWc('taro-input')

export default React.forwardRef((props, ref) => {
  const args = { ...props }

  if (args.hasOwnProperty('focus')) {
    args.autoFocus = Boolean(args.focus)
    delete args.focus
  }

  return (
    <Input {...args} ref={ref} />
  )
})
