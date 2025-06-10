import React, { PropsWithChildren } from 'react'

import { convertPX2Int } from '../../../utils'

import type { BaseEventOrig } from '@tarojs/components'
import type { VirtualWaterfallProps } from '..'
import type { IProps } from '../preset'

function getRenderExpandNodes ({
  direction,
  id: sid,
  innerElement,
  renderExpand,
}: {
  direction: 'top' | 'bottom'
  id: string
  innerElement: VirtualWaterfallProps['innerElementType']
  renderExpand?: VirtualWaterfallProps['renderTop'] | VirtualWaterfallProps['renderBottom']
}) {
  const id = `${sid}-${direction}`
  const props: any = {
    key: id,
    id,
    style: {
      visibility: 'hidden',
      height: 100,
      marginTop: -100,
      zIndex: -1,
    }
  }
  const expands = [renderExpand && React.createElement(renderExpand), React.createElement(innerElement!, props)]
  if (direction === 'top') {
    expands.reverse()
  }
  return expands
}

const outerWrapper = React.forwardRef(
  function OuterWrapper (props, ref) {
    const {
      id, className, style, children,
      outerElementType, innerElementType,
      onScroll, onScrollNative,
      renderTop, renderBottom,
      ...rest
    } = props as PropsWithChildren<IProps>
    const handleScroll = (event: BaseEventOrig<VirtualWaterfallProps.IVirtualWaterfallEventDetail>) => {
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

    return React.createElement<any>(outerElementType, {
      ref,
      id,
      className,
      style,
      scrollY: true,
      onScroll: handleScroll,
      ...rest
    }, [
      getRenderExpandNodes({
        direction: 'top',
        id,
        innerElement: innerElementType,
        renderExpand: renderTop,
      }),
      children,
      getRenderExpandNodes({
        direction: 'bottom',
        id,
        innerElement: innerElementType,
        renderExpand: renderBottom,
      }),
    ])
  }
)

export default outerWrapper
