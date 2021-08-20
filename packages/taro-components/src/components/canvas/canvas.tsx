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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Prop, Element, Event } from '@stencil/core'

const LONG_TAP_DELAY = 500

@Component({
  tag: 'taro-canvas-core',
  styleUrl: './style/index.css'
})
export class Canvas implements ComponentInterface {
  private timer: NodeJS.Timeout

  @Prop() canvasId: string

  @Element() el: HTMLElement

  @Event({
    eventName: 'longtap'
  })

  onLongTap

  onTouchStart = () => {
    this.timer = setTimeout(() => {
      this.onLongTap.emit()
    }, LONG_TAP_DELAY)
  }

  onTouchMove = () => {
    clearTimeout(this.timer)
  }

  onTouchEnd = () => {
    clearTimeout(this.timer)
  }

  render () {
    const { canvasId } = this

    return (
      <canvas
        canvas-id={canvasId}
        style={{
          width: '100%',
          height: '100%'
        }}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
      />
    )
  }
}
