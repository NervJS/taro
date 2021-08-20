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

export interface TabItemConfig {
  showRedDot?: boolean,
  tabBarBadge?: string | number,
  tabBarLabel?: string,
  iconPath?: string,
  selectedIconPath?: string,
}

// 设置全局的tabbar config 中的内容定义
export interface TaroTabBarConfig {
  needAnimate: boolean,
  tabBarVisible: boolean,
  tabStyle: {
    backgroundColor?: string,
    borderStyle?: string,
    color?: string,
    selectedColor?: string
  },
  tabItems: Record<number, TabItemConfig>,
}

export interface CallbackResult {
  errMsg: string
  eventChannel?: any
}

export interface BaseOption {
  success?: (res: CallbackResult) => void
  fail?: (res: CallbackResult) => void
  complete?: (res: CallbackResult) => void
}

export type OptionsFunc = (res: CallbackResult) => void
