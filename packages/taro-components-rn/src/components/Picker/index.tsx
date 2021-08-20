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

/**
 * All:
 *   ✔ value
 *   ✔ onChange
 *   ✔ onCancel
 * Selector:
 *   ✔ range
 *   ✔ rangeKey
 *   ✔ disabled
 * MultiSelector:
 *   ✔ range
 *   ✔ rangeKey
 *   ✔ disabled
 *   ✔ onColumnChange
 * Time:
 *   ✔ start
 *   ✔ end
 *   ✔ disabled
 * Date:
 *   ✔ start
 *   ✔ end
 *   ✘ fields
 *   ✔ disabled
 * Region:
 *   ✔ customItem
 *   ✔ disabled
 *
 * @hint Picker 里面嵌套的子组件要支持绑定 onPress 事件才能弹出选择框
 */

import * as React from 'react'

import Selector from './selector'
import MultiSelector from './multiSelector'
import TimeSelector from './time'
import DateSelector from './date'
import RegionSelector from './region'

export default class _Picker extends React.Component<any> {
  static defaultProps = {
    mode: 'selector',
  }

  render (): JSX.Element | null {
    const {
      mode,
    } = this.props

    if (mode === 'selector') {
      return <Selector {...this.props} />
    } else if (mode === 'multiSelector') {
      return <MultiSelector {...this.props} />
    } else if (mode === 'time') {
      return <TimeSelector {...this.props} />
    } else if (mode === 'date') {
      return <DateSelector {...this.props} />
    } else if (mode === 'region') {
      return <RegionSelector {...this.props} />
    } else {
      return null
    }
  }
}
