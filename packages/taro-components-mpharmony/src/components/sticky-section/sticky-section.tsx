import { StandardProps } from '@tarojs/components'
import React, { FC } from 'react'

export const StickySection: FC<StandardProps> = ({ children, style, className }) => {
  return <div style={typeof style === 'string' ? {} : style} className={className}>{children}</div>
}
