import { View } from '@tarojs/components'
import React from 'react'

export interface ListItemProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const ListItem: React.FC<ListItemProps> = ({ children, className, style }) => {
  return <View className={className} style={style}>{children}</View>
}

export { ListItem }
export default ListItem
