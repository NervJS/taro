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

import type { TaroElement } from '../dom/element'
import type { PageInstance, Instance, PageProps } from '../dsl/instance'
import type { Func, MpEvent, EventHandler, UpdatePayload } from '../interface'
import type { EventsType } from '../emitter/emitter'
import type { TaroEvent } from '../dom/event'
import type { TaroEventTarget } from '../dom/event-target'

export interface GetLifecycle<Instance = any> {
  (instance: Instance, lifecyle: keyof PageInstance): Func | Array<Func> | undefined
}

export interface GetPathIndex {
  (indexOfNode: number): string
}

export interface GetEventCenter {
  (Events: EventsType): InstanceType<EventsType>
}

export interface IsBubbleEvents {
  (eventName: string): boolean
}

export interface GetSpecialNodes {
  (): string[]
}

export interface OnRemoveAttribute {
  (element: TaroElement, qualifiedName: string): void
}

export interface ModifyMpEvent {
  (event: MpEvent): void
}

export interface ModifyTaroEvent {
  (event: TaroEvent, element: TaroElement): void
}

export interface BatchedEventUpdates {
  (cb: Func): void
}

type Inst = Instance<PageProps>
export interface MergePageInstance {
  (prev: Inst | undefined, next: Inst): void
}

export interface CreatePullDownComponent<Instance = any> {
  (el: Instance, path: string, framework, customWrapper?: any): void
}

export interface GetDOMNode<Instance = any, DOMElement = TaroElement> {
  (instance: Instance): DOMElement | undefined
}

export interface InitNativeApi {
  (taro: Record<string, any>): void
}

export interface ModifyHydrateData {
  (data: Record<string, any>): void
}

export interface ModifySetAttrPayload {
  (element: TaroElement, key: string, payload: UpdatePayload): void
}

export interface ModifyRmAttrPayload {
  (element: TaroElement, key: string, payload: UpdatePayload): void
}

export interface OnAddEvent<T extends TaroEventTarget = TaroEventTarget> {
  (type: string, handler: EventHandler, options: any, node: T): void
}

export interface patchElement {
  (node: TaroElement): void
}

export interface IHooks {
  /** 解决 React 生命周期名称的兼容问题 */
  getLifecycle: GetLifecycle

  /** 解决百度小程序的模版语法问题 */
  getPathIndex: GetPathIndex

  /** 解决支付宝小程序分包时全局作用域不一致的问题 */
  getEventCenter: GetEventCenter

  isBubbleEvents: IsBubbleEvents

  getSpecialNodes: GetSpecialNodes

  /** 解决 Vue2 布尔值属性值的设置问题 */
  onRemoveAttribute?: OnRemoveAttribute

  /**
   * @multi-inject
   * 用于修改小程序原生事件对象
   **/
  modifyMpEvent: ModifyMpEvent

  /**
   * @multi-inject
   * 用于修改 Taro DOM 事件对象
   **/
  modifyTaroEvent: ModifyTaroEvent

  /** 用于把 React 同一事件回调中的所有 setState 合并到同一个更新处理中 */
  batchedEventUpdates?: BatchedEventUpdates

  /** 用于处理 React 中的小程序生命周期 hooks */
  mergePageInstance?: MergePageInstance

  /** H5 下拉刷新 wrapper */
  createPullDownComponent?: CreatePullDownComponent

  /** H5 获取原生 DOM 对象 */
  getDOMNode?: GetDOMNode

  /**
   * @multi-inject
   * 挂载属性或 API 到 Taro 对象上
   **/
  initNativeApi?: InitNativeApi

  /**
   * @todo: mutiInject
   * 修改 Taro DOM 序列化数据
   **/
  modifyHydrateData?: ModifyHydrateData

  /**
   * @todo: mutiInject
   * 修改 Taro DOM 序列化数据
   **/
  modifySetAttrPayload?: ModifySetAttrPayload

  /**
   * @todo: mutiInject
   * 修改 Taro DOM 序列化数据
   **/
  modifyRmAttrPayload?: ModifyRmAttrPayload

  /**
   * @todo: mutiInject
   * 调用 addEventListener 时触发
   **/
  onAddEvent?: OnAddEvent

  /**
   * @todo: mutiInject
   * 给 TaroElement 实例注入属性或方法
   **/
  patchElement?: patchElement
}
