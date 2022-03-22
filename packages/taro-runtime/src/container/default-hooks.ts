import { ContainerModule } from 'inversify'
import { BUBBLE_EVENTS } from '../constants/events'
import {
  SID_GET_MINI_LIFECYCLE,
  SID_GET_LIFECYCLE,
  SID_GET_PATH_INDEX,
  SID_GET_EVENT_CENTER,
  SID_IS_BUBBLE_EVENTS,
  SID_GET_SPECIAL_NODES
} from '../constants/identifiers'

import type {
  MiniLifecycle,
  IsBubbleEvents,
  GetEventCenter,
  GetMiniLifecycle,
  GetLifecycle,
  GetPathIndex,
  GetSpecialNodes
} from '../interface'

export const defaultMiniLifecycle: MiniLifecycle = {
  app: [
    'onLaunch',
    'onShow',
    'onHide'
  ],
  page: [
    'onLoad',
    'onUnload',
    'onReady',
    'onShow',
    'onHide',
    [
      'onPullDownRefresh',
      'onReachBottom',
      'onPageScroll',
      'onResize',
      'onTabItemTap',
      'onTitleClick',
      'onOptionMenuClick',
      'onPopMenuClick',
      'onPullIntercept',
      'onAddToFavorites'
    ]
  ]
}

const getMiniLifecycle: GetMiniLifecycle = function (defaultConfig) {
  return defaultConfig
}

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

const getSpecialNodes = function () {
  return ['view', 'text', 'image']
}

export const DefaultHooksContainer = new ContainerModule(bind => {
  function bindFunction<T> (sid: string, target) {
    return bind<T>(sid).toFunction(target)
  }
  bindFunction<GetLifecycle>(SID_GET_MINI_LIFECYCLE, getMiniLifecycle)
  bindFunction<GetLifecycle>(SID_GET_LIFECYCLE, getLifecycle)
  bindFunction<GetPathIndex>(SID_GET_PATH_INDEX, getPathIndex)
  bindFunction<GetEventCenter>(SID_GET_EVENT_CENTER, getEventCenter)
  bindFunction<IsBubbleEvents>(SID_IS_BUBBLE_EVENTS, isBubbleEvents)
  bindFunction<GetSpecialNodes>(SID_GET_SPECIAL_NODES, getSpecialNodes)
})
