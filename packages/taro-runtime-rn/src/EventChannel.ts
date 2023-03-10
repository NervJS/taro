/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { getRouteEventChannel } from '@tarojs/router-rn'

import { Events } from './emmiter'

interface ExeListItem {
  eventName: string
  data: Record<string, any>
}

interface RouteEvt extends Events {
  addEvents: (events: any) => void
  emit?: (events: any, data: any) => void
}

interface PageEvt extends Events {
  exeList: any[]
  emit?: (events: any, data: any) => void
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
