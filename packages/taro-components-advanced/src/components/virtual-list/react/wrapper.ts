import React, { PropsWithChildren } from 'react'

import { convertPX2Int } from '../../../utils'

import type { BaseEventOrig } from '@tarojs/components'
import type { VirtualListProps } from '..'
import type { IProps } from '../preset'

function getRenderExpandNodes ({
  direction,
  isVertical,
  isRtl,
  id: sid,
  innerElement,
  renderExpand,
}: {
  direction: 'top' | 'bottom' | 'left' | 'right'
  isVertical: boolean
  isRtl: boolean
  id: string
  innerElement: VirtualListProps['innerElementType']
  renderExpand?: VirtualListProps['renderTop'] | VirtualListProps['renderBottom']
}) {
  const id = `${sid}-${direction}`
  const props: any = {
    id
  }
  if (!renderExpand) {
    props.style = {
      visibility: 'hidden',
      height: isVertical ? 100 : '100%',
      width: isVertical ? '100%' : 100,
      [isVertical ? 'marginTop' : isRtl ? 'marginRight' : 'marginLeft']: -100,
      zIndex: -1,
    }
  }
  return renderExpand || React.createElement(
    innerElement!,
    props,
  )
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
    const isVertical = layout === 'vertical'
    const isRtl = direction === 'rtl'

    return React.createElement<any>(outerElementType!, {
      ref,
      id,
      className,
      style,
      scrollY: isVertical,
      scrollX: !isVertical,
      onScroll: handleScroll,
      ...rest
    }, [
      getRenderExpandNodes({
        direction: isVertical ? 'top' : isRtl ? 'right' : 'left',
        isVertical,
        isRtl,
        id,
        innerElement: innerElementType,
        renderExpand: renderTop,
      }),
      children,
      getRenderExpandNodes({
        direction: isVertical ? 'bottom' : isRtl ? 'left' : 'right',
        isVertical,
        isRtl,
        id,
        innerElement: innerElementType,
        renderExpand: renderBottom,
      }),
    ])
  }
)

export default outerWrapper
