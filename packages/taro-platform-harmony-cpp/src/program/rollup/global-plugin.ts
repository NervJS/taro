import path from 'node:path'

import { transformSync } from '@babel/core'
import { isFunction } from '@tarojs/shared'
import { TARO_COMP_SUFFIX } from '@tarojs/vite-runner/dist/harmony/entry'

import { getProjectId, isLocalPath, parseLocalPath, PKG_NAME, PKG_VERSION, SEP_RGX } from '../../utils'
import transformGlobalModePlugin from '../babel/global'
import { babelPresets } from '../babel/presets'
import { entryFileName, loadLibraryFunctionName, setLibraryFunctionName } from '../template/entry'

import type { TaroHarmonyPageMeta } from '@tarojs/vite-runner/dist/harmony/template/page'
import type { PluginContext } from 'rollup'
import type { PluginOption } from 'vite'
import type Harmony from '..'
import type { PageParser } from '../vite/style'

interface IPluginOption {
  moduleId?: string
  [key: string]: unknown
}

export function fixImportCode(
  importStr: string[],
  { projectId = '', sourcePath = '', fileName = '', chorePackagePrefix = '' }
) {
  importStr.forEach((item, idx) => {
    if (SEP_RGX.test(item)) {
      importStr[idx] = item.replace(SEP_RGX, '/')
    }
  })
  const typeImport: string[] = importStr.filter((item) => item.startsWith('import type'))
  const nativeImport: string[] = importStr.filter(
    (item) =>
      !typeImport.includes(item) &&
      /['"](@(kit\.|ohos\.|system\.|hmscore\/\/).*|@jd-oh[\\/](?!taro_cpp_library\b).*|@tarojs[\\/]components|lib.+\.so)['"]/.test(
        item
      )
  )
  const localEtsImport: string[] = importStr.filter((item) => {
    if (!typeImport.includes(item) && !nativeImport.includes(item)) {
      const sourceValue = item.match(/['"](.+)['"]/)?.[1] || ''
      if (isLocalPath(sourceValue)) {
        const source = parseLocalPath(fileName, sourcePath, sourceValue)
        if (source === 'render') return true
        if (source.startsWith('static/')) return true
        if (source.endsWith('.json')) return true
        if (source.endsWith(TARO_COMP_SUFFIX)) return true
      } else {
        if (sourceValue.includes(`${PKG_NAME}/dist/runtime/runtime-harmony`)) return true
      }
    }
  })
  const restImport: string[] = importStr.filter(
    (item) => !typeImport.includes(item) && !nativeImport.includes(item) && !localEtsImport.includes(item)
  )
  typeImport.length > 0 && typeImport.push('')
  nativeImport.length > 0 && nativeImport.push('')
  localEtsImport.length > 0 && localEtsImport.push('')
  const idx = restImport.findIndex(item => item.includes(TARO_COMP_SUFFIX) || item.endsWith('.js'))
  if (idx >= 0) {
    const source = restImport[idx].match(/['"](.+)['"]/)?.[1] || ''
    if (source) {
      nativeImport.unshift(`import '${source}'`)
    }
  }
  importStr.splice(0, importStr.length, ...typeImport, ...nativeImport, ...localEtsImport)
  importStr.push(
    `import { ${loadLibraryFunctionName}, ${setLibraryFunctionName} } from "${chorePackagePrefix}/${entryFileName}"`,
    '',
    transformSync(restImport.join('\n'), {
      filename: fileName,
      configFile: false,
      presets: babelPresets,
      plugins: [
        transformGlobalModePlugin({ chorePackagePrefix, projectId, sourcePath, fileName, isGlobal: false, type: 'TaroAny' }),
        require.resolve('@babel/plugin-syntax-typescript'),
      ],
    })?.code || restImport.join('\n')
  )

  return importStr
}

export default function (this: Harmony | void, opt: IPluginOption = {}): PluginOption {
  const { moduleId = '' } = opt
  const that = this

  return {
    name: 'taro:rollup-harmony-import-global',
    buildStart (this: PluginContext) {
      const pluginContext = this
      if (!that) return
      const { runnerUtils, runOpts } = that.context
      const isPureComp = runOpts?.options?.args.pure

      const { getViteHarmonyCompilerContext } = runnerUtils
      const compiler = getViteHarmonyCompilerContext(pluginContext)!
      const { taroConfig, cwd: appPath } = compiler
      const { sourceRoot = 'src' } = taroConfig
      const projectId = moduleId || getProjectId(taroConfig?.projectName)
      const chorePackagePrefix = runOpts?.config.chorePackagePrefix
      const sourcePath = path.posix.join(appPath, sourceRoot)

      if (compiler) {
        compiler.loaderMeta ||= {}
        compiler.loaderMeta.enableParseJSXStyle = true
      }

      if (!isPureComp && compiler?.components instanceof Array) {
        compiler.components.forEach((config: TaroHarmonyPageMeta) => {
          const oddModifyPageImport = config.modifyPageImport
          config.modifyPageImport = function (this: PageParser, importStr: string[], page: TaroHarmonyPageMeta) {
            if (isFunction(oddModifyPageImport)) {
              // FIXME 当前 page 模板误删 taro_comp 的引用
              // Note: 删除 createComponent 的引用, 这会在 JSVM 内调用
              const idx = importStr.findIndex(item => item.includes(TARO_COMP_SUFFIX))
              importStr.splice(idx, 1, importStr[idx].replace(/createComponent,\s[^'"]*from\s*/, ''))
              oddModifyPageImport.call(this, importStr, page)
            }

            fixImportCode(importStr, {
              chorePackagePrefix,
              projectId,
              sourcePath,
              fileName: page.name,
            })
          }
        })
      }
    },
    renderChunk (code, chunk) {
      const pluginContext = this
      let isGlobal = false
      let projectId = ''
      let sourcePath = path.posix.join(process.cwd(), 'src')
      let chorePackagePrefix = ''
      if (that) {
        const { runnerUtils, runOpts } = that?.context || {}
        const { getViteHarmonyCompilerContext } = runnerUtils || {}
        const compiler = getViteHarmonyCompilerContext(pluginContext)!
        const { taroConfig, cwd: appPath } = compiler
        const { sourceRoot = 'src' } = taroConfig
        sourcePath = path.posix.join(appPath, sourceRoot)
        projectId = getProjectId(taroConfig?.projectId?.projectName)
        chorePackagePrefix = runOpts?.config.chorePackagePrefix
      } else {
        isGlobal = true
        projectId = moduleId
      }

      try {
        const result = transformSync(code, {
          filename: chunk.fileName,
          presets: babelPresets,
          plugins: [
            require.resolve('@babel/plugin-syntax-typescript'),
            transformGlobalModePlugin({
              chorePackagePrefix,
              projectId,
              sourcePath,
              fileName: chunk.fileName,
              isGlobal,
            }),
          ],
        })
        // Note: 可以考虑 code 生成 md5 值替代 timeStamp
        if (isGlobal) {
          return {
            code: `/*! ${JSON.stringify({ taroVersion: PKG_VERSION, timeStamp: Date.now(), projectId })} */\n(() => {${
              result?.code || code
            }})();\n`,
            map: result?.map || null,
          }
        } else {
          return {
            code: `/*! ${JSON.stringify({ taroVersion: PKG_VERSION, timeStamp: Date.now(), projectId })} */\n
            (({setTimeout, setInterval, clearTimeout, clearInterval, __taro_registryNextFrame}) => {${
  result?.code || code
}})(((currentPage) => {
                return {
                  setTimeout: currentPage ? (fn, time) => {
                    return globalThis.__taro_registryTimeout(currentPage, fn, time);
                  } : globalThis.setTimeout,
                  setInterval: currentPage ? (fn, time) => {
                    return globalThis.__taro_registryInterval(currentPage, fn, time);
                  } : globalThis.setInterval,
                  clearTimeout: currentPage ? (timerId) => {
                    globalThis.__taro_un_registryTimeout(timerId, currentPage);
                  } : globalThis.clearTimeout,
                  clearInterval: currentPage ? (timerId) => {
                    globalThis.__taro_un_registryInterval(timerId, currentPage);
                  } : globalThis.clearInterval,
                  __taro_registryNextFrame: currentPage ? (fn) => {
                    return globalThis.__taro_registryNextFrame(currentPage, fn);
                  } : globalThis.requestAnimationFrame,
                }
            })(globalThis.__page_id));\n`,
            map: result?.map || null,
          }
        }
      } catch (error) {
        console.error('taro:rollup-harmony-import-global transform error:', error)
      }
    },
  }
}
