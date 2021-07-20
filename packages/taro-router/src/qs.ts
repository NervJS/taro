import { routerConfig } from './init'
import queryString from 'query-string'

export const qs = function (stamp = 0) {
  const search = routerConfig.router.mode === 'hash'
    ? location.hash.slice(routerConfig.router.pathname.length + 1)
    : location.search
  const query = search
    ? queryString.parse(search.substr(1))
    : {}

  if (stamp) {
    query.stamp = stamp.toString()
  }
  return query
}
