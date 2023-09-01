import React, { PropsWithChildren } from 'react'

import { convertPX2Int } from '../../../utils'

import type { BaseEventOrig } from '@tarojs/components'
import type { VirtualListProps } from '..'
import type { IProps } from '../preset'

function getRenderExpandNodes ({
  direction,
  isHorizontal,
  isRtl,
  id: sid,
  innerElement,
  renderExpand,
}: {
  direction: 'top' | 'bottom' | 'left' | 'right'
  isHorizontal: boolean
  isRtl: boolean
  id: string
  innerElement: VirtualListProps['innerElementType']
  renderExpand?: VirtualListProps['renderTop'] | VirtualListProps['renderBottom']
}) {
  const props: any = {
    id: `${sid}-${direction}`,
    style: {
      visibility: 'hidden',
      height: isHorizontal ? '100%' : 100,
      width: isHorizontal ? 100 : '100%',
      [isHorizontal ? isRtl ? 'marginRight' : 'marginLeft': 'marginTop']: -100,
      zIndex: -1,
    }
  }
  const expands = [renderExpand, React.createElement(
    innerElement!,
    props,
  )]
  if (isHorizontal ? isRtl ? direction === 'right' : direction === 'left' : direction === 'top') {
    expands.reverse()
  }
  return expands
}

const outerWrapper = React.forwardRef(
  function OuterWrapper (props, ref) {
    const {
      id = '', className, style = {}, children,
      outerElementType, innerElementType,
      onScroll, onScrollNative,
      renderTop, renderBottom,
      layout, direction,
      ...rest
    } = props as PropsWithChildren<IProps>
    const handleScroll = (event: BaseEventOrig<VirtualListProps.IVirtualListEventDetail>) => {
      onScroll?.({
        ...event as any,
        currentTarget: {
          ...event.detail,
          clientWidth: convertPX2Int(style.width),
          clientHeight: convertPX2Int(style.height)
        } as any
      })

      if (typeof onScrollNative === 'function') {
        onScrollNative(event)
      }
    }
    const isHorizontal = layout === 'horizontal'
    const isRtl = direction === 'rtl'

    return React.createElement<any>(outerElementType!, {
      ref,
      id,
      className,
      style,
      scrollY: !isHorizontal,
      scrollX: isHorizontal,
      onScroll: handleScroll,
      ...rest
    }, [
      getRenderExpandNodes({
        direction: isHorizontal ? isRtl ? 'right' : 'left': 'top',
        isHorizontal,
        isRtl,
        id,
        innerElement: innerElementType,
        renderExpand: renderTop,
      }),
      children,
      getRenderExpandNodes({
        direction: isHorizontal ? isRtl ? 'left' : 'right' : 'bottom',
        isHorizontal,
        isRtl,
        id,
        innerElement: innerElementType,
        renderExpand: renderBottom,
      }),
    ])
  }
)

export default outerWrapper
