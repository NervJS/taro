import { inject, injectable, multiInject, /* multiInject, */ optional } from 'inversify'
import {
  SID_GET_MINI_LIFECYCLE,
  SID_GET_LIFECYCLE,
  SID_GET_PATH_INDEX,
  SID_GET_EVENT_CENTER,
  SID_IS_BUBBLE_EVENTS,
  SID_GET_SPECIAL_NODES,
  SID_ON_REMOVE_ATTRIBUTE,
  SID_BATCHED_EVENT_UPDATES,
  SID_MERGE_PAGE_INSTANCE,
  SID_CREATE_PULLDOWN_COMPONENT,
  SID_GET_DOM_NODE,
  SID_MODIFY_HYDRATE_DATA,
  SID_MODIFY_SET_ATTR_PAYLOAD,
  SID_MODIFY_RM_ATTR_PAYLOAD,
  SID_ON_ADD_EVENT,
  SID_MODIFY_MP_EVENT,
  SID_MODIFY_TARO_EVENT,
  SID_INIT_NATIVE_API,
  SID_PATCH_ELEMENT

} from './constants/identifiers'
import { defaultMiniLifecycle } from './container/default-hooks'

import type { TaroElement } from './dom/element'
import type { TaroEvent } from './dom/event'
import type {
  IHooks,
  OnRemoveAttribute,
  GetMiniLifecycle,
  GetLifecycle,
  GetPathIndex,
  GetEventCenter,
  ModifyMpEvent,
  ModifyTaroEvent,
  IsBubbleEvents,
  GetSpecialNodes,
  BatchedEventUpdates,
  MergePageInstance,
  CreatePullDownComponent,
  GetDOMNode,
  InitNativeApi,
  ModifySetAttrPayload,
  ModifyHydrateData,
  ModifyRmAttrPayload,
  MpEvent,
  OnAddEvent,
  patchElement
} from './interface'

@injectable()
export class Hooks implements IHooks {
  @inject(SID_GET_MINI_LIFECYCLE)
  public getMiniLifecycle: GetMiniLifecycle

  public getMiniLifecycleImpl () {
    return this.getMiniLifecycle(defaultMiniLifecycle)
  }

  @inject(SID_GET_LIFECYCLE)
  public getLifecycle: GetLifecycle

  @inject(SID_GET_PATH_INDEX)
  public getPathIndex: GetPathIndex

  @inject(SID_GET_EVENT_CENTER)
  public getEventCenter: GetEventCenter

  @inject(SID_IS_BUBBLE_EVENTS)
  public isBubbleEvents: IsBubbleEvents

  @inject(SID_GET_SPECIAL_NODES)
  public getSpecialNodes: GetSpecialNodes

  @inject(SID_ON_REMOVE_ATTRIBUTE) @optional()
  public onRemoveAttribute?: OnRemoveAttribute

  @inject(SID_BATCHED_EVENT_UPDATES) @optional()
  public batchedEventUpdates?: BatchedEventUpdates

  @inject(SID_MERGE_PAGE_INSTANCE) @optional()
  public mergePageInstance?: MergePageInstance

  @inject(SID_CREATE_PULLDOWN_COMPONENT) @optional()
  public createPullDownComponent?: CreatePullDownComponent

  @inject(SID_GET_DOM_NODE) @optional()
  public getDOMNode?: GetDOMNode

  @inject(SID_MODIFY_HYDRATE_DATA) @optional()
  public modifyHydrateData?: ModifyHydrateData

  @inject(SID_MODIFY_SET_ATTR_PAYLOAD) @optional()
  public modifySetAttrPayload?: ModifySetAttrPayload

  @inject(SID_MODIFY_RM_ATTR_PAYLOAD) @optional()
  public modifyRmAttrPayload?: ModifyRmAttrPayload

  @inject(SID_ON_ADD_EVENT) @optional()
  public onAddEvent?: OnAddEvent

  @multiInject(SID_MODIFY_MP_EVENT) @optional()
  private modifyMpEventImpls?: ModifyMpEvent[]

  public modifyMpEvent (e: MpEvent) {
    this.modifyMpEventImpls?.forEach(fn => fn(e))
  }

  @multiInject(SID_MODIFY_TARO_EVENT) @optional()
  private modifyTaroEventImpls?: ModifyTaroEvent[]

  public modifyTaroEvent (e: TaroEvent, element: TaroElement) {
    this.modifyTaroEventImpls?.forEach(fn => fn(e, element))
  }

  @multiInject(SID_INIT_NATIVE_API) @optional()
  public initNativeApiImpls?: InitNativeApi[]

  public initNativeApi (taro: Record<string, any>) {
    this.initNativeApiImpls?.forEach(fn => fn(taro))
  }

  @multiInject(SID_PATCH_ELEMENT) @optional()
  public patchElementImpls?: patchElement[]

  public patchElement (element: TaroElement) {
    this.patchElementImpls?.forEach(fn => fn(element))
  }
}
