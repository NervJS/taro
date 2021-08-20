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
 *
 * Based on original code from: https://github.com/qiu8310/minapp/blob/master/packages/minapp-wx/typing/wx.d.ts
 * Lincenced under MIT license: https://github.com/qiu8310/minapp/issues/69
 *
 */
declare namespace Taro {
  namespace getMenuButtonBoundingClientRect {
    /** 菜单按钮的布局位置信息 */
    interface Rect {
      /** 下边界坐标，单位：px */
      bottom: number
      /** 高度，单位：px */
      height: number
      /** 左边界坐标，单位：px */
      left: number
      /** 右边界坐标，单位：px */
      right: number
      /** 上边界坐标，单位：px */
      top: number
      /** 宽度，单位：px */
      width: number
    }
  }

  /** 获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/menu/wx.getMenuButtonBoundingClientRect.html
   */
  function getMenuButtonBoundingClientRect(): getMenuButtonBoundingClientRect.Rect
}
