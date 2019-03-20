import { Location } from '../utils/types';

export const addLeadingSlash = (path: string): string =>
  path.charAt(0) === '/' ? path : '/' + path

export const stripLeadingSlash = (path: string): string =>
  path.charAt(0) === '/' ? path.substr(1) : path

export const hasBasename = (path: string, prefix: string): boolean =>
  new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i').test(path)

export const stripBasename = (path: string, prefix: string): string =>
  hasBasename(path, prefix) ? path.substr(prefix.length) : path

export const stripTrailingSlash = (path: string): string =>
  path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path

export const parsePath = (path: string): Pick<Location, "path" | "search" | "hash"> => {
  let pathname = path || '/'
  let search = ''
  let hash = ''

  const hashIndex = pathname.indexOf('#')
  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex)
    pathname = pathname.substr(0, hashIndex)
  }

  const searchIndex = pathname.indexOf('?')
  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex)
    pathname = pathname.substr(0, searchIndex)
  }

  return {
    path: pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash
  }
}

export const createPath = (location: Location): string => {
  const { path, search, hash } = location

  let pathname = path || '/'

  if (search && search !== '?') { pathname += search.charAt(0) === '?' ? search : `?${search}` }

  if (hash && hash !== '#') pathname += hash.charAt(0) === '#' ? hash : `#${hash}`

  return pathname
}
