import { View } from '@tarojs/components'
import React from 'react'

export interface StickySectionProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const StickySection: React.FC<StickySectionProps> = ({ children, className, style }) => {
  return <View className={className} style={style}>{children}</View>
}

export { StickySection }
export default StickySection
