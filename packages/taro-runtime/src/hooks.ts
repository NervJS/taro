import { inject, injectable, multiInject, /* multiInject, */ optional } from 'inversify'
import SERVICE_IDENTIFIER from './constants/identifiers'

import type {
  IHooks,
  OnRemoveAttribute,
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
  OnAddEvent
} from './interface'
import type { TaroElement } from './dom/element'
import type { TaroEvent } from './dom/event'

@injectable()
export class Hooks implements IHooks {
  @inject(SERVICE_IDENTIFIER.getLifecycle)
  public getLifecycle: GetLifecycle

  @inject(SERVICE_IDENTIFIER.getPathIndex)
  public getPathIndex: GetPathIndex

  @inject(SERVICE_IDENTIFIER.getEventCenter)
  public getEventCenter: GetEventCenter

  @inject(SERVICE_IDENTIFIER.isBubbleEvents)
  public isBubbleEvents: IsBubbleEvents

  @inject(SERVICE_IDENTIFIER.getSpecialNodes)
  public getSpecialNodes: GetSpecialNodes

  @inject(SERVICE_IDENTIFIER.onRemoveAttribute) @optional()
  public onRemoveAttribute?: OnRemoveAttribute

  @inject(SERVICE_IDENTIFIER.modifyMpEvent) @optional()
  private modifyMpEventImpls?: ModifyMpEvent[]

  public modifyMpEvent (e: MpEvent) {
    this.modifyMpEventImpls?.forEach(fn => fn(e))
  }

  @multiInject(SERVICE_IDENTIFIER.modifyTaroEvent) @optional()
  private modifyTaroEventImpls?: ModifyTaroEvent[]

  public modifyTaroEvent (e: TaroEvent, element: TaroElement) {
    this.modifyTaroEventImpls?.forEach(fn => fn(e, element))
  }

  @inject(SERVICE_IDENTIFIER.batchedEventUpdates) @optional()
  public batchedEventUpdates?: BatchedEventUpdates

  @inject(SERVICE_IDENTIFIER.mergePageInstance) @optional()
  public mergePageInstance?: MergePageInstance

  @inject(SERVICE_IDENTIFIER.createPullDownComponent) @optional()
  public createPullDownComponent?: CreatePullDownComponent

  @inject(SERVICE_IDENTIFIER.getDOMNode) @optional()
  public getDOMNode?: GetDOMNode

  @inject(SERVICE_IDENTIFIER.initNativeApi) @optional()
  public initNativeApi?: InitNativeApi

  @inject(SERVICE_IDENTIFIER.modifyHydrateData) @optional()
  public modifyHydrateData?: ModifyHydrateData

  @inject(SERVICE_IDENTIFIER.modifySetAttrPayload) @optional()
  public modifySetAttrPayload?: ModifySetAttrPayload

  @inject(SERVICE_IDENTIFIER.modifyRmAttrPayload) @optional()
  public modifyRmAttrPayload?: ModifyRmAttrPayload

  @inject(SERVICE_IDENTIFIER.onAddEvent) @optional()
  public onAddEvent?: OnAddEvent
}
