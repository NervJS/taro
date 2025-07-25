import React from 'react'

export interface ListItemProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const ListItem: React.FC<ListItemProps> = ({ children, className, style }) => {
  return <div className={className} style={style}>{children}</div>
}

export default ListItem
