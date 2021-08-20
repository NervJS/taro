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

/// <reference path="taro.lifecycle.d.ts" />
/// <reference path="taro.component.d.ts" />

declare namespace Taro {
  /**
   * 页面展示时的回调。
   */
  function useDidShow(callback: () => any): void

  /**
   * 页面隐藏时的回调。
   */
  function useDidHide(callback: () => any): void

  /**
   * 下拉刷新时的回调。
   */
  function usePullDownRefresh(callback: () => any): void

  /**
   * 上拉触底时的回调。
   */
  function useReachBottom(callback: () => any): void

  /**
   * 页面滚动时的回调。
   */
  function usePageScroll(callback: (payload: PageScrollObject) => any): void

  /**
   * 页面尺寸改变时的回调。
   */
  function useResize(callback: () => any): void

  /**
   * 页面转发时的回调。
   */
  function useShareAppMessage(callback: (payload: ShareAppMessageObject) => ShareAppMessageReturn): void

  /**
   * 当前是 tab 页时，tab 被点击时的回调。
   */
  function useTabItemTap(callback: (payload: TabItemTapObject) => any): void

  /**
   * 用户点击右上角菜单“收藏”按钮时的回调。
   */
  function useAddToFavorites(callback: (paload: AddToFavoritesObject) => AddToFavoritesReturnObject): void

  /**
   * 用户点击右上角菜单“分享到朋友圈”按钮时的回调。
   */
  function useShareTimeline(callback: () => ShareTimelineReturnObject): void

  /**
   * 页面初次渲染完成的回调。
   * 此时页面已经准备妥当，可以和视图层进行交互。
   */
  function useReady(callback: () => any): void

  /**
   * 获取当前路由参数。
   */
  function useRouter<TParams extends Partial<Record<string, string>> = Partial<Record<string, string>>>(dynamic?: boolean): RouterInfo<TParams>

  /**
   * 导航栏的标题被点击时的回调。
   * **仅支付宝小程序支持。**
   */
  function useTitleClick(callback: () => any): void

  /**
   * 导航栏的额外图标被点击时的回调。
   * **仅支付宝小程序支持。**
   */
  function useOptionMenuClick(callback: () => any): void

  /**
   * 下拉中断时的回调。
   * **仅支付宝小程序支持。**
   */
  function usePullIntercept(callback: () => any): void
}
