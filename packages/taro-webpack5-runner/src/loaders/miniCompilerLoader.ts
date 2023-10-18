import { fs, swc } from '@tarojs/helper'
import { getComponentsAlias } from '@tarojs/shared'
import { getOptions } from 'loader-utils'
import * as path from 'path'

let FILE_COUNTER = 0
const FILE_COUNTER_MAP = new Map<string, number>()

const COMPILE_MODE = 'compileMode'

export default async function (source) {
  const callback = this.async()
  const options = getOptions(this)
  const resourcePath = this.resourcePath

  // @TODO 思考非 JSX 文件应该如何处理 p3
  if (!((/\.[tj]sx$/.test(resourcePath)) && source.includes(COMPILE_MODE))) {
    return callback(null, source)
  }

  const { template, outputDir, fileType } = options

  template.componentsAlias = getComponentsAlias(template.internalComponents)
  const components = template.createMiniComponents(template.internalComponents)

  if (!FILE_COUNTER_MAP.has(resourcePath)) {
    FILE_COUNTER_MAP.set(resourcePath, FILE_COUNTER++)
  }

  // @TODO 保留 JSX p2
  try {
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
            legacyDecorator: true
          },
          experimental: {
            plugins: [
              [
                path.join(path.dirname(require.resolve('@tarojs/helper')), './swc/plugin-compile-mode/target/wasm32-wasi/release/swc_plugin_compile_mode.wasm'),
                {
                  tmpl_prefix: `f${FILE_COUNTER_MAP.get(resourcePath)}`,
                  components,
                  adapter: template.Adapter,
                }
              ]
            ]
          }
        }
      })

    const regExp = /var\s+TARO_TEMPLATES_(\w+)\s*=\s*'(.+)';/g
    let res
    while((res = regExp.exec(code)) !== null) {
      const [, $0, $1] = res
      const outputPath = path.join(outputDir, 'taro_xmls', `${$0}${fileType.templ}`)
      // 小程序 xml 不支持 unescape，在此处对被 SWC 转义后的字符作还原
      const content = $1.replace(/\\([xu])([a-fA-F0-9]{2,4})/g, (_, $1: string, $2: string) => {
        const isUnicode = $1 === 'u'
        const num = isUnicode ? $2 : $2.substring(0,2)
        const charCode = parseInt(num, 16)
        return String.fromCharCode(charCode) + (!isUnicode ? $2.substring(2) : '')
      })
      await fs.outputFile(outputPath, content)
    }
    callback(null, code.replace(regExp, ''))
  } catch (err) {
    callback(err)
  }
}
