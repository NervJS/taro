import { taroLocationProvider as location } from '../bom/window'

// export const removeLeadingSlash = (str = '') => str.replace(/^\.?\//, '')
// export const removeTrailingSearch = (str = '') => str.replace(/\?[\s\S]*$/, '')
export const addLeadingSlash = (url = '') => (url.charAt(0) === '/' ? url : '/' + url)

export const hasBasename = (path = '', prefix = '') =>
  new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i').test(path) || path === prefix

export const stripBasename = (path = '', prefix = '') =>
  hasBasename(path, prefix) ? path.substring(prefix.length) : path

export const stripTrailing = (str = '') => str.replace(/[?#][\s\S]*$/, '')

export const stripSuffix = (path = '', suffix = '') =>
  path.includes(suffix) ? path.substring(0, path.length - suffix.length) : path

export const getHomePage = (path = '', basename = '', customRoutes: Record<string, string | string[]> = {}, entryPagePath = '') => {
  const routePath = addLeadingSlash(stripBasename(path, basename))
  const alias = Object.entries(customRoutes).find(
    ([key]) => key === routePath
  )?.[1] || routePath
  return entryPagePath || (typeof alias === 'string' ? alias : alias[0]) || basename
}

export const getCurrentPage = (routerMode = 'hash', basename = '/') => {
  const pagePath = routerMode === 'hash'
    ? location.hash.slice(1).split('?')[0]
    : location.pathname
  return addLeadingSlash(stripBasename(pagePath, basename))
}
