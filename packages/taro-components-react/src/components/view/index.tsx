/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

import 'weui'
import './style/index.css'

import classNames from 'classnames'
import React from 'react'

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

class View extends React.Component<IProps, IState> {
  state = {
    hover: false,
    touch: false
  }

  timeoutEvent: ReturnType<typeof setTimeout>
  startTime = 0

  render () {
    const {
      className,
      hoverClass,
      onTouchStart,
      onTouchEnd,
      onTouchMove,
      hoverStartTime = 50,
      hoverStayTime = 400,
      ...other
    } = this.props

    const cls = classNames(
      '',
      {
        [`${hoverClass}`]: this.state.hover
      },
      className
    )

    const _onTouchStart = e => {
      if (hoverClass) {
        this.setState(() => ({
          touch: true
        }))
        setTimeout(() => {
          if (this.state.touch) {
            this.setState(() => ({
              hover: true
            }))
          }
        }, hoverStartTime)
      }
      onTouchStart && onTouchStart(e)
      if (this.props.onLongPress) {
        this.timeoutEvent = setTimeout(() => {
          this.props.onLongPress!()
        }, 350)
        this.startTime = new Date().getTime()
      }
    }

    const _onTouchMove = e => {
      clearTimeout(this.timeoutEvent)
      onTouchMove && onTouchMove(e)
    }

    const _onTouchEnd = e => {
      const spanTime = new Date().getTime() - this.startTime
      if (spanTime < 350) {
        clearTimeout(this.timeoutEvent)
      }
      if (hoverClass) {
        this.setState(() => ({
          touch: false
        }))
        setTimeout(() => {
          if (!this.state.touch) {
            this.setState(() => ({
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
        {this.props.children}
      </div>
    )
  }
}

export default View
