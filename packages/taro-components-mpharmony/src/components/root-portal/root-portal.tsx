import { FC } from 'preact/compat'
import React, { CSSProperties, ReactNode } from 'react'

interface Props {
  enable?: boolean
  style?: CSSProperties | undefined
  children?: ReactNode | undefined
}

export const RootPortal: FC<Props> = ({ enable = true, style, children }: Props) => {
  return <div
    style={enable ? { position: 'fixed', width: '100%', height: '100%' } : { position: 'static' }}>
    {style ? <div style={style}>{children}</div> : children}
  </div>
}
