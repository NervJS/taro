import { swc } from '@tarojs/helper'
import { COMPILE_MODE_IDENTIFIER_PREFIX, COMPILE_MODE_SUB_RENDER_FN, getComponentsAlias } from '@tarojs/shared'
import { isUrlRequest, urlToRequest } from 'loader-utils'

import { templatesCache, XMLDependency } from '../plugins/MiniCompileModePlugin'

import type { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared/dist/template'
import type { LoaderContext } from 'webpack'

const COMPILE_MODE = 'compileMode'
const templatesSourceTag = 'TARO_TEMP'

interface IOptions {
  platform: string
  template: RecursiveTemplate | UnRecursiveTemplate
  FILE_COUNTER_MAP: Map<string, number>
}

export default async function (this: LoaderContext<IOptions>, source) {
  const callback = this.async()
  const options: IOptions = this.getOptions()
  const resourcePath = this.resourcePath
  // @TODO 思考非 JSX 文件应该如何处理 p3
  if (!((/\.[tj]sx$/.test(resourcePath)) && source.includes(COMPILE_MODE))) {
    return callback(null, source)
  }

  const { platform, template, FILE_COUNTER_MAP } = options

  template.componentsAlias = getComponentsAlias(template.internalComponents)
  const components = template.createMiniComponents(template.internalComponents)

  if (!FILE_COUNTER_MAP.has(resourcePath)) {
    FILE_COUNTER_MAP.set(resourcePath, FILE_COUNTER_MAP.size + 1)
  }
  const fileCount = FILE_COUNTER_MAP.get(resourcePath)
  try {
    const identifier = `${COMPILE_MODE_IDENTIFIER_PREFIX}${fileCount}`
    const { code } = await swc
      .transform(source, {
        filename: resourcePath,
        sourceMaps: false,
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: true
          },
          transform: {
            legacyDecorator: true,
            react: {
              runtime: 'automatic'
            }
          },
          experimental: {
            plugins: [
              [
                '@tarojs/helper/swc/swc_plugin_compile_mode_pre_process.wasm',
                {
                  sub_render_fn: COMPILE_MODE_SUB_RENDER_FN,
                }
              ],
              [
                '@tarojs/helper/swc/swc_plugin_compile_mode.wasm',
                {
                  platform,
                  tmpl_prefix: identifier,
                  components,
                  adapter: template.Adapter,
                  template_tag: templatesSourceTag,
                  is_use_xs: template.isUseXS,
                }
              ]
            ]
          }
        }
      })

    const templatesList: string[] = []
    const RE_TEMPLATES = new RegExp(`var\\s+TARO_TEMPLATES_(\\w+)\\s*=\\s*('|")${templatesSourceTag}\\s*(.*?)\\s*${templatesSourceTag}\\2`, 'g')

    // 抓取模板内容
    let res
    while ((res = RE_TEMPLATES.exec(code)) !== null) {
      const [, , , raw] = res
      // 小程序 xml 不支持 unescape，在此处对被 SWC 转义后的字符作还原
      const content: string = unescape(raw)
      templatesList.push(content)
    }

    // 输出模板内容到单独的文件或 base.xml
    const templatesString = templatesList.join('\n')
    if (template.isXMLSupportRecursiveReference) {
      this._module?.addDependency(new XMLDependency({
        identifier,
        context: this.rootContext,
        content: templatesString,
        resourcePath,
        fileCount,
      }))
    } else {
      templatesCache.push(templatesString)
    }

    // 引用 wxs 文件
    const importings: any[] = []
    const RE_XML_SOURCES = /var\s+TARO_XML_SOURCES\s*=\s*(\[[\s\S]*?\])/
    if ((res = RE_XML_SOURCES.exec(code)) !== null) {
      const listStr = res[1]
      const reg = /["'](.*?)["']/g
      while ((res = reg.exec(listStr)) !== null) {
        const [, dep] = res
        if (isUrlRequest(dep)) {
          const request = urlToRequest(dep)
          importings.push(this.importModule(request))
        }
      }
    }
    await Promise.all(importings)

    callback(null, code.replace(RE_TEMPLATES, ''))
  } catch (err) {
    callback(err)
  }
}

function unescape (raw: string): string {
  let temp = raw.replace(/\\([xu])([a-fA-F0-9]{2,4})/g, (_, $1: string, $2: string) => {
    const isUnicode = $1 === 'u'
    const num = isUnicode ? $2 : $2.substring(0, 2)
    const charCode = parseInt(num, 16)
    return String.fromCharCode(charCode) + (!isUnicode ? $2.substring(2) : '')
  })
  temp = temp.replace(/\\'/g, "'")
  temp = temp.replace(/\\"/g, '"')
  return temp
}
