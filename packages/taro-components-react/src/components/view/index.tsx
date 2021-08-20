/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import 'weui'
import React from 'react'
import classNames from 'classnames'
import './style/index.css'

interface IProps {
  hoverClass?: string
  className?: string
  hoverStartTime?: number
  hoverStayTime?: number
  onTouchStart? (e: React.TouchEvent<HTMLDivElement>): void
  onTouchEnd? (e: React.TouchEvent<HTMLDivElement>): void
  onTouchMove? (e: React.TouchEvent<HTMLDivElement>): void
  onLongPress? (): void
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

  timeoutEvent: NodeJS.Timeout;
  startTime = 0;

  render () {
    const {
      hoverClass,
      onTouchStart,
      onTouchEnd,
      onTouchMove,
      className,
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
        this.startTime = (new Date()).getTime()
      }
    }

    const _onTouchMove = e => {
      clearTimeout(this.timeoutEvent)
      onTouchMove && onTouchMove(e)
    }

    const _onTouchEnd = e => {
      const spanTime = (new Date().getTime()) - this.startTime
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
        {...other}
        className={cls}
        onTouchStart={_onTouchStart}
        onTouchEnd={_onTouchEnd}
        onTouchMove={_onTouchMove}
      >
        {this.props.children}
      </div>
    )
  }
}

export default View
