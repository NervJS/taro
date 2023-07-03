import { StickySectionProps } from '@tarojs/components/dist/types/StickySection'
import React, { FC } from 'react'

export const StickySection: FC<StickySectionProps> = ({ children, style, className }) => {
  return <div style={typeof style === 'string' ? {} : style} className={className}>{children}</div>
}
