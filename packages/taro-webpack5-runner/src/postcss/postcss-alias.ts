import { isAliasPath, replaceAliasPath } from '@tarojs/helper'

const pattern = /(url\(\s*['"]?)([^"')]+)(["']?\s*\))/g

interface IOptions {
  alias?: Record<string, string>
}

const postcssAlias = (options: IOptions = {}) => {
  return {
    postcssPlugin: 'postcss-alias',
    Once (styles, { result }) {
      if (!options.alias || !Object.keys(options.alias).length) return

      const opts = result.opts
      const from = opts.from

      styles.walkDecls(decl => {
        if (pattern.test(decl.value)) {
          decl.value = decl.value.replace(pattern, (matched, before, url, after) => {
            url = url.replace(/^~/, '')
            if (isAliasPath(url, options.alias)) {
              const newUrl = replaceAliasPath(from, url, options.alias)
              return `${before}${newUrl}${after}`
            } else {
              return matched
            }
          })
        }
      })
    }
  }
}

postcssAlias.postcss = true

export default postcssAlias
