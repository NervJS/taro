import React from 'react'

export interface StickyHeaderProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const StickyHeader: React.FC<StickyHeaderProps> = ({ children, className, style }) => {
  return <div className={className} style={style}>{children}</div>
}

export default StickyHeader
