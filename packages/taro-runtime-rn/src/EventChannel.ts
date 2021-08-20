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

import { getRouteEventChannel } from '@tarojs/router-rn'
import { Events } from './emmiter'

interface ExeListItem {
  eventName: string,
  data: Record<string, any>
}

interface RouteEvt extends Events {
  addEvents: (events: any) => void
  emit?: (events: any, data: any) => void,
}

interface PageEvt extends Events {
  exeList: any[],
  emit?: (events: any, data: any) => void,
}

class PageEvts extends Events {
  exeList = []

  on (eventName, callback) {
    super.on(eventName, callback, this)
    this.exeList = this.exeList.reduce((prev: any, item: ExeListItem) => {
      if (item.eventName === eventName) {
        super.trigger(item.eventName, item.data)
      } else {
        prev.push(item)
      }
      return prev
    }, [])
    return this
  }

  emit (events, data) {
    // eslint-disable-next-line
    routeChannel.trigger(events, data)
  }
}

const pageChannel: PageEvt = new PageEvts()

class RouteEvts extends Events {
  emit (events, data) {
    pageChannel.off(events, null, null)
    pageChannel.exeList.push({
      eventName: events,
      data
    })
  }

  addEvents (events) {
    if (!events || typeof events !== 'object') return
    Object.keys(events).forEach(key => {
      this.off(key, null, null)
      this.on(key, events[key], this)
    })
  }
}

const routeChannel: RouteEvt = new RouteEvts()

getRouteEventChannel(routeChannel)

export default {
  routeChannel,
  pageChannel
}
