import React from 'react'

export interface StickySectionProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const StickySection: React.FC<StickySectionProps> = ({ children, className, style }) => {
  return <div className={className} style={style}>{children}</div>
}

export default StickySection
