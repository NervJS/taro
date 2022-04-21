/**
 * 针对页面级缓存内容，以 page.taroPath 为 key
 */

import type * as HistoryType from '../bom/history'
import type * as LocationType from '../bom/location'

interface CacheContent {
  history: HistoryType.History
  location: LocationType.Location
}

const pageMap = new Map()

function init (pageId: string, options: CacheContent) {
  pageMap.set(pageId, {
    history: options.history,
    location: options.location
  })
}

function destroy (pageId: string) {
  pageMap.delete(pageId)
}

function has (pageId: string) {
  return pageMap.has(pageId)
}

function getLocation (pageId: string): LocationType.Location {
  return pageMap.get(pageId).location
}

function getHistory (pageId: string): HistoryType.History {
  return pageMap.get(pageId).history
}

export {
  init,
  destroy,
  has,
  getHistory,
  getLocation
}
