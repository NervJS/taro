import classNames from 'classnames'

import { useEffect, useState } from '../../utils/hooks'
import { createForwardRefComponent } from '../../utils/index'

import type { TFunc } from '@tarojs/runtime/dist/runtime.esm'
import type React from 'react'

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverClass?: string
  hoverStartTime?: number
  hoverStayTime?: number
  onTouchStart?(e: React.TouchEvent<HTMLDivElement>): void
  onTouchEnd?(e: React.TouchEvent<HTMLDivElement>): void
  onTouchMove?(e: React.TouchEvent<HTMLDivElement>): void
  onLongPress?(): void
  forwardedRef?: React.MutableRefObject<HTMLDivElement>
}

function View ({
  className,
  hoverClass,
  forwardedRef,
  onTouchStart,
  onTouchEnd,
  onTouchMove,
  hoverStartTime = 50,
  hoverStayTime = 400,
  ...other
}: IProps) {
  let timeoutEvent: ReturnType<typeof setTimeout>
  let startTime = 0
  const [hover, setHover] = useState<boolean>(false)
  const [touch, setTouch] = useState<boolean>(false)

  const [cls, setCls] = useState<string>(classNames(
    '',
    {
      [`${hoverClass}`]: process.env.FRAMEWORK === 'solid' ? (hover as unknown as TFunc)() : hover
    },
    className
  ))

  const _onTouchStart = e => {
    if (hoverClass) {
      setTouch(true)
      setTimeout(() => {
        if (process.env.FRAMEWORK === 'solid' ? (touch as unknown as TFunc)() : touch) {
          setHover(true)
        }
      }, hoverStartTime)
    }
    onTouchStart && onTouchStart(e)
    if (other.onLongPress) {
      timeoutEvent = setTimeout(() => {
        other.onLongPress!()
      }, 350)
      startTime = new Date().getTime()
    }
  }

  const _onTouchMove = e => {
    clearTimeout(timeoutEvent)
    onTouchMove && onTouchMove(e)
  }

  const _onTouchEnd = e => {
    const spanTime = new Date().getTime() - startTime
    if (spanTime < 350) {
      clearTimeout(timeoutEvent)
    }
    if (hoverClass) {
      setTouch(false)
      setTimeout(() => {
        if (process.env.FRAMEWORK === 'solid' ? (touch as unknown as TFunc)() : touch) {
          setHover(false)
        }
      }, hoverStayTime)
    }
    onTouchEnd && onTouchEnd(e)
  }

  useEffect(() => {
    setCls(classNames(
      '',
      {
        [`${hoverClass}`]: process.env.FRAMEWORK === 'solid' ? (hover as unknown as TFunc)() : hover
      },
      className
    ))
  }, [hover, className])

  return (
    <div
      ref={forwardedRef}
      className={process.env.FRAMEWORK === 'solid' ? (cls as unknown as TFunc)() : cls as string}
      onTouchStart={_onTouchStart}
      onTouchEnd={_onTouchEnd}
      onTouchMove={_onTouchMove}
      {...other}
    >
      {other.children}
    </div>
  )
}


export default createForwardRefComponent(View)
