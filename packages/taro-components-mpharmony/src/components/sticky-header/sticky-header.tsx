import { StandardProps } from '@tarojs/components'
import React, { FC } from 'react'

export const StickyHeader: FC<StandardProps> = ({ className, children, hidden = false }) => {

  return <div className={className} style={{
    display: 'flex',
    position: 'sticky',
    left: 0,
    top: 0,
    flexDirection: 'column'
  }} hidden={hidden}>
    {children}
  </div>
}
