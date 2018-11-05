/**
 * Created by Wu Jian Ping on 2018/11/1.
 */

const postcss = require('postcss')
const path = require('path')
const utils = require('./utils')

const URL_PATTERNS = [
  /(url\(\s*['"]?)([^"')]+)(["']?\s*\))/g,
  /(AlphaImageLoader\(\s*src=['"]?)([^"')]+)(["'])/g
]

const getPattern = decl => URL_PATTERNS.find((pattern) => pattern.test(decl.value))

module.exports = postcss.plugin('postcss-plugin-image-to-url', (options) => {
  options = options || {}

  return function (styles, result) {
    const opts = result.opts
    const from = opts.from ? path.dirname(opts.from) : '.'

    styles.walkDecls(decl => {

      const isNotUrl = !utils.isUrl(decl.value)

      if (isNotUrl) {
        const pattern = getPattern(decl)

        if (!pattern) return

        decl.value = decl.value.replace(pattern, (matched, before, url, after) => {
          let index = url.indexOf('?')
          if (index !== -1) {
            url = url.substr(0, index)
          }
          let source = path.join(from, url)
          if (utils.isFont(url)) {
            let file = utils.getFile(source)
            let encodeStr = utils.encodeFile(file, 'base64', true)
            return `${before}${encodeStr}${after}`
          } else if (utils.isImage(url)) {
            let target = path.join(utils.getAppPath(), options.staticDirectory, utils.getFileNameWithHash(source))
            utils.createDirIfNotExists(path.dirname(target))
            utils.copyFile(source, target)
            return `${before}${options.publicPath}${path.basename(target)}${after}`
          }
        })
      }
    })
  }
})
