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

export default {
  routeChannel,
  pageChannel
}
