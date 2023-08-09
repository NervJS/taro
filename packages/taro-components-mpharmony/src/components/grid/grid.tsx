import './style/index.scss'

import React, { FC, ReactNode } from 'react'

import { SimpleGrid } from './simple_grid'
import { WaterfallFlow } from './waterfall-flow'

interface Props {
  children: ReactNode
  className?: string
  type: 'aligned' | 'masonry'
  crossAxisCount: number
  maxCrossAxisExtent: number
  mainAxisGap?: number
  crossAxisGap?: number
}

export const GridView: FC<Props> = ({ children, className, crossAxisGap, type, maxCrossAxisExtent, crossAxisCount, mainAxisGap }) => {

  // @ts-ignore
  return type === 'aligned' ? <SimpleGrid className={className} mainAxisGap={mainAxisGap} crossAxisGap={crossAxisGap} crossAxisCount={crossAxisCount} maxCrossAxisExtent={maxCrossAxisExtent}>{children}</SimpleGrid> : <WaterfallFlow className={className} mainAxisGap={mainAxisGap} crossAxisGap={crossAxisGap} crossAxisCount={crossAxisCount} maxCrossAxisExtent={maxCrossAxisExtent}>{children}</WaterfallFlow>
}
