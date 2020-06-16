import { routerConfig } from './init'

export const qs = function () {
  const params = {}

  const search = routerConfig.router.mode === 'hash'
    ? location.hash.slice(routerConfig.router.pathname.length + 1)
    : location.search

  search.substr(1).split('&').forEach(pair => {
    const [key, value] = pair.split('=')
    params[key] = value
  })

  return params
}
