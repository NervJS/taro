import './style/index.css'

import classNames from 'classnames'

import { useState } from '../../utils/hooks'

import type React from 'react'

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverClass?: string
  hoverStartTime?: number
  hoverStayTime?: number
  onTouchStart?(e: React.TouchEvent<HTMLDivElement>): void
  onTouchEnd?(e: React.TouchEvent<HTMLDivElement>): void
  onTouchMove?(e: React.TouchEvent<HTMLDivElement>): void
  onLongPress?(): void
}

interface IState {
  hover: boolean
  touch: boolean
}
type TSolidState = () => IState

function View ({
  className,
  hoverClass,
  onTouchStart,
  onTouchEnd,
  onTouchMove,
  hoverStartTime = 50,
  hoverStayTime = 400,
  ...other
}: IProps) {
  let timeoutEvent: ReturnType<typeof setTimeout>
  let startTime = 0
  const [state, setState] = useState<IState>({
    hover: false,
    touch: false
  })

  const cls = classNames(
    '',
    {
      [`${hoverClass}`]: ((process.env.FRAMEWORK === 'solid' ? (state as TSolidState)() : state) as IState).hover
    },
    className
  )

  const _onTouchStart = e => {
    if (hoverClass) {
      setState((e) => ({
        ...e,
        touch: true
      }))
      setTimeout(() => {
        if (((process.env.FRAMEWORK === 'solid' ? (state as TSolidState)() : state) as IState).touch) {
          setState((e) => ({
            ...e,
            hover: true
          }))
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
      setState((e) => ({
        ...e,
        touch: false
      }))
      setTimeout(() => {
        if (!((process.env.FRAMEWORK === 'solid' ? (state as TSolidState)() : state) as IState).touch) {
          setState((e) => ({
            ...e,
            hover: false
          }))
        }
      }, hoverStayTime)
    }
    onTouchEnd && onTouchEnd(e)
  }

  return (
    <div
      className={cls}
      onTouchStart={_onTouchStart}
      onTouchEnd={_onTouchEnd}
      onTouchMove={_onTouchMove}
      {...other}
    >
      {other.children}
    </div>
  )
}

export default View
