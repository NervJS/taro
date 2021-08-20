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
import { Component, h, ComponentInterface, Prop, Event, EventEmitter } from '@stencil/core'

@Component({
  tag: 'taro-web-view-core',
  styleUrl: './style/index.scss'
})
export class WebView implements ComponentInterface {
  @Prop() src: string

  @Event({
    eventName: 'load'
  })
  onLoad: EventEmitter

  @Event({
    eventName: 'error'
  })
  onError: EventEmitter

  render () {
    const {
      src,
      onLoad,
      onError
    } = this
    return (
      <iframe
        class='taro-webview'
        onLoad={(e: Event) => {
          e.stopPropagation()
          onLoad.emit({ src })
        }}
        onError={(e: Event) => {
          e.stopPropagation()
          onError.emit({ src })
        }}
        src={src}
      />
    )
  }
}
