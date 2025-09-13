import { View } from '@tarojs/components'
import React from 'react'

export interface StickyHeaderProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const StickyHeader: React.FC<StickyHeaderProps> = ({ children, className, style }) => {
  return <View className={className} style={style}>{children}</View>
}

export { StickyHeader }
export default StickyHeader
