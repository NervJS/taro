import { getRouteEventChannel } from '@tarojs/router-rn'
import { Events } from './emmiter'

interface ExeListItem {
  eventName: string,
  data: object
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
    super.off(eventName, callback, this)
    return this
  }

  emit (events, data) {
    routeChannel.trigger(events, data)
    routeChannel.off(events, null, routeChannel)
  }
}

class RouteEvts extends Events {
  emit (events, data) {
    pageChannel.exeList.push({
      eventName: events,
      data
    })
  }

  addEvents (events) {
    if (!events || typeof events !== 'object') return
    Object.keys(events).forEach(key => {
      this.on(key, events[key], this)
    })
  }
}

const routeChannel: RouteEvt = new RouteEvts()
const pageChannel: PageEvt = new PageEvts()

getRouteEventChannel(routeChannel)

export default {
  routeChannel,
  pageChannel
}
