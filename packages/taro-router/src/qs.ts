import { routerConfig } from './init'
import queryString from 'query-string'

export const qs = function () {
  const search = routerConfig.router.mode === 'hash'
    ? location.hash.slice(routerConfig.router.pathname.length + 1)
    : location.search

  return search
    ? queryString.parse(search.substr(1))
    : {}
}
