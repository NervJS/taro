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

import { ContainerModule } from 'inversify'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { BUBBLE_EVENTS } from '../constants/events'

import type { IsBubbleEvents, GetEventCenter, GetLifecycle, GetPathIndex, GetSpecialNodes } from '../interface'

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
  bind<GetLifecycle>(SERVICE_IDENTIFIER.getLifecycle).toFunction(getLifecycle)
  bind<GetPathIndex>(SERVICE_IDENTIFIER.getPathIndex).toFunction(getPathIndex)
  bind<GetEventCenter>(SERVICE_IDENTIFIER.getEventCenter).toFunction(getEventCenter)
  bind<IsBubbleEvents>(SERVICE_IDENTIFIER.isBubbleEvents).toFunction(isBubbleEvents)
  bind<GetSpecialNodes>(SERVICE_IDENTIFIER.getSpecialNodes).toFunction(getSpecialNodes)
})
