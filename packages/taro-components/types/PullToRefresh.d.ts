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

import { ComponentType } from 'react'

interface Indicator {
  activate?: React.ReactNode
  deactivate?: React.ReactNode
  release?: React.ReactNode
  finish?: React.ReactNode
}

interface PullToRefreshProps {
  refreshing?: boolean
  distanceToRefresh: number
  onRefresh: () => void
  indicator: Indicator
  prefixCls?: string
  className?: string
  style?: React.CSSProperties
  damping: number
}

/** 下拉组件
 * @ignore
 */
declare const PullToRefresh: ComponentType<PullToRefreshProps>

export { PullToRefresh, PullToRefreshProps }
