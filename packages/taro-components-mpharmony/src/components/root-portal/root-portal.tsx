import { FC } from 'preact/compat'
import React, { CSSProperties, ReactNode } from 'react'

interface Props {
  enable?: boolean
  style?: CSSProperties | undefined
  children?: ReactNode | undefined
}

export const RootPortal: FC<Props> = ({ enable = true, style, children }: Props) => {
  return <div style={style ? { position: enable ? 'fixed' : 'static', ...style } : { position: enable ? 'fixed' : 'static' }}>
    {children}
  </div>
}
