import React from 'react'
import reactifyWc from '../utils/reactify-wc'

const Input = reactifyWc('taro-input')

export default function Index (props) {
  const args = { ...props }

  if (args.hasOwnProperty('focus')) {
    args.autoFocus = Boolean(args.focus)
    delete args.focus
  }

  return (
    <Input {...args} />
  )
}
