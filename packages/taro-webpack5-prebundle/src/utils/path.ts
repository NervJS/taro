export const addLeadingSlash = (url = '') => (url.charAt(0) === '/' ? url : '/' + url)
export const addTrailingSlash = (url = '') => (url.charAt(url.length - 1) === '/' ? url : url + '/')
export function parsePublicPath (publicPath = '/') {
  return ['', 'auto'].includes(publicPath) ? publicPath : addTrailingSlash(publicPath)
}