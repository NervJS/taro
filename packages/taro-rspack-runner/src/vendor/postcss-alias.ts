/**
 * 与 @tarojs/webpack5-runner 的 src/postcss/postcss-alias.ts 逻辑一致，独立维护一份。
 */
import { isAliasPath, replaceAliasPath } from '@tarojs/helper'

const pattern = /(url\(\s*['"]?)([^"')]+)(["']?\s*\))/g

interface IOptions {
  alias?: Record<string, string>
}

const postcssAlias = (options: IOptions = {}) => {
  return {
    postcssPlugin: 'postcss-alias',
    Once (styles: any, { result }: any) {
      if (!options.alias || !Object.keys(options.alias).length) return

      const opts = result.opts
      const from = opts.from

      styles.walkDecls((decl: any) => {
        if (pattern.test(decl.value)) {
          decl.value = decl.value.replace(pattern, (matched: string, before: string, url: string, after: string) => {
            url = url.replace(/^~/, '')
            if (isAliasPath(url, options.alias!)) {
              const newUrl = replaceAliasPath(from, url, options.alias!)
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
