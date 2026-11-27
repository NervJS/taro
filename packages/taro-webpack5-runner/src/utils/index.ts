export {
  addHtmlSuffix,
  addLeadingSlash,
  addTrailingSlash,
  emptyTogglableObj,
  formatOpenHost,
  hasBasename,
  isSpecialFormat,
  parsePublicPath,
  stripBasename,
  stripTrailingSlash
} from '@tarojs/runner-utils'

export const getRootPath = function () {
  return require('node:path').resolve(__dirname, '../../')
}
