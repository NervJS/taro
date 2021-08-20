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
import { StandardProps, CommonEventFunction } from './common'

/** 滚动选择器子项
 * 仅可放置于 `<PickerView />` 中，其孩子节点的高度会自动设置成与 picker-view 的选中框的高度一致
 * @classification forms
 * @supported weapp, swan, alipay, tt
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/picker-view-column.html
 */
declare const PickerViewColumn: ComponentType<StandardProps>

export { PickerViewColumn }
