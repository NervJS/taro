import React from 'react'
import { View, Text } from '@tarojs/components'
import taro from '@tarojs/taro'
import './index.scss'

console.log({taro})
interface Props {
  className?: string,
  style?: any,
  children?: any
  title?: string
}
function Cell ({ children, style }: Props) {
  const childs = Array.isArray(children) ? children : [children]
  return (
    <View className={'cellGroup'} style={{ ...style }}>
      {
        childs.map((it, i) => (
          [it].concat(i === children.length - 1 ? [] : <View key={`line-${i}`} className="cellItem__line"></View>)
        ))
      }
    </View>
  )
}
function Item ({ title, children, style }: Props) {
  return <View className={'cellItem'} style={{ ...style }}>
    <Text className="cellItem__title">
      {title}
    </Text>
    <View className="cellItem__content">
      {children}
    </View>
  </View>
}

Cell.Item = Item

export default Cell
