import { ContainerModule } from 'inversify'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { BUBBLE_EVENTS } from '../constants/events'

import type { IsBubbleEvents, GetEventCenter, GetLifecycle, GetPathIndex } from '../interface'

const getLifecycle: GetLifecycle = function (instance, lifecycle) {
  return instance[lifecycle]
}

const getPathIndex: GetPathIndex = function (indexOfNode) {
  return `[${indexOfNode}]`
}

const getEventCenter: GetEventCenter = function (Events) {
  return new Events()
}

const isBubbleEvents = function (eventName) {
  return BUBBLE_EVENTS.has(eventName)
}

export const DefaultHooksContainer = new ContainerModule(bind => {
  bind<GetLifecycle>(SERVICE_IDENTIFIER.getLifecycle).toFunction(getLifecycle)
  bind<GetPathIndex>(SERVICE_IDENTIFIER.getPathIndex).toFunction(getPathIndex)
  bind<GetEventCenter>(SERVICE_IDENTIFIER.getEventCenter).toFunction(getEventCenter)
  bind<IsBubbleEvents>(SERVICE_IDENTIFIER.isBubbleEvents).toFunction(isBubbleEvents)
})
