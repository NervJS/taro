import queryString from 'query-string'

import { routerConfig } from './init'

function getSearch () {
  let search = '?'
  if (routerConfig.router.mode === 'hash') {
    const idx = location.hash.indexOf('?')
    if (idx > -1) {
      search = location.hash.slice(idx)
    }
  } else {
    search = location.search
  }
  return search.substr(1)
}

export const qs = function (stamp = 0) {
  const search = getSearch()
  const query = search
    ? queryString.parse(search)
    : {}

  if (stamp) {
    query.stamp = stamp.toString()
  }
  return query
}
