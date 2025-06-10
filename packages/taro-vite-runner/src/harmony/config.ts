import path from 'node:path'

import { babel } from '@rollup/plugin-babel'
import inject from '@rollup/plugin-inject'
import terser from '@rollup/plugin-terser'
import { defaultMainFields, fs, PLATFORMS, recursiveMerge, REG_NODE_MODULES_DIR, resolveMainFilePath } from '@tarojs/helper'
import { getSassLoaderOption } from '@tarojs/runner-utils'
import { isArray, PLATFORM_TYPE } from '@tarojs/shared'

import increment from '../common/rollup-plugin-increment'
import { getDefaultPostcssConfig } from '../postcss/postcss.harmony'
import { getBabelOption, getCSSModulesOptions, getMinify, getMode, getPostcssPlugins, isVirtualModule, stripMultiPlatformExt, stripVirtualModulePrefix, virtualModulePrefixREG } from '../utils'
import { DEFAULT_TERSER_OPTIONS, HARMONY_SCOPES } from '../utils/constants'
import { logger } from '../utils/logger'
import { TARO_COMP_SUFFIX } from './entry'
import { QUERY_IS_NATIVE_SCRIPT } from './ets'
import { PAGE_SUFFIX } from './page'

import type { RollupInjectOptions } from '@rollup/plugin-inject'
import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { InputPluginOption, OutputOptions } from 'rollup'
import type { Plugin, PluginOption } from 'vite'
import type { TaroHarmonyPageMeta } from './template/page'

export default function (viteCompilerContext: ViteHarmonyCompilerContext): PluginOption {
  const { taroConfig, cwd: appPath } = viteCompilerContext
  function getDefineOption() {
    const {
      buildAdapter = PLATFORMS.HARMONY,
      env = {},
      defineConstants = {},
      framework = 'react',
    } = taroConfig

    env.FRAMEWORK = JSON.stringify(framework)
    env.TARO_ENV = JSON.stringify(buildAdapter)
    env.TARO_PLATFORM = JSON.stringify(process.env.TARO_PLATFORM || env.TARO_PLATFORM || PLATFORM_TYPE.HARMONY)
    env.TARO_VERSION = JSON.stringify(process.env.TARO_VERSION || env.TARO_VERSION)
    env.NODE_ENV = JSON.stringify(process.env.NODE_ENV || env.NODE_ENV || 'development')
    env.SUPPORT_TARO_POLYFILL = env.SUPPORT_TARO_POLYFILL || '"disabled"'
    const envConstants = Object.keys(env).reduce((target, key) => {
      target[`process.env.${key}`] = env[key]
      return target
    }, {})

    return {
      ...envConstants,
      ...defineConstants,
    }
  }

  function getAliasOption() {
    const { alias = {} } = taroConfig
    return Object.entries(alias).map(([find, replacement]) => {
      return { find, replacement }
    })
  }

  function getNativeComponentEntry () {
    const nativeCompPathList: string[] = []

    for (const comp of viteCompilerContext.nativeComponents.values()) {
      if (comp.isPackage) continue
      nativeCompPathList.push(comp.templatePath + QUERY_IS_NATIVE_SCRIPT)
    }

    return nativeCompPathList
  }

  function getEntryOption() {
    const { isBuildNativeComp, blended } = taroConfig
    if (isBuildNativeComp) {
      return viteCompilerContext.components!.map(page => page.scriptPath).concat(getNativeComponentEntry())
    } else if (blended) {
      return viteCompilerContext.pages!.map(page => {
        if (page.isNative) {
          const { sourceDir, nativeExt } = viteCompilerContext as ViteHarmonyCompilerContext
          const nativePath = resolveMainFilePath(path.join(sourceDir, page.name), nativeExt)

          return nativePath + QUERY_IS_NATIVE_SCRIPT
        } else {
          return page.scriptPath
        }
      }).concat(getNativeComponentEntry())
    }

    return taroConfig.entry.app
  }

  function getInjectOption(): RollupInjectOptions {
    const options: RollupInjectOptions = {
      window: ['@tarojs/runtime', 'window'],
      document: ['@tarojs/runtime', 'document'],
      navigator: ['@tarojs/runtime', 'navigator'],
      requestAnimationFrame: ['@tarojs/runtime', 'requestAnimationFrame'],
      cancelAnimationFrame: ['@tarojs/runtime', 'cancelAnimationFrame'],
      Element: ['@tarojs/runtime', 'TaroElement'],
      SVGElement: ['@tarojs/runtime', 'SVGElement'],
      MutationObserver: ['@tarojs/runtime', 'MutationObserver'],
      history: ['@tarojs/runtime', 'history'],
      location: ['@tarojs/runtime', 'location'],
      URLSearchParams: ['@tarojs/runtime', 'URLSearchParams'],
      getComputedStyle: ['@tarojs/runtime', 'getComputedStyle'],
      URL: ['@tarojs/runtime', 'URL'],
      wx: ['@tarojs/taro', '*'],
      getCurrentPages: ['@tarojs/taro', 'getCurrentPages'],
      IntersectionObserver: ['@tarojs/taro', 'IntersectionObserver']
    }

    const injectOptions = taroConfig.injectOptions

    if (injectOptions?.include) {
      for (const key in injectOptions.include) {
        options[key] = injectOptions.include[key]
      }
    }

    if (injectOptions?.exclude?.length) {
      injectOptions.exclude.forEach((item) => {
        delete options[item]
      })
    }

    return options
  }

  const __postcssOption = getDefaultPostcssConfig({
    designWidth: taroConfig.designWidth || 750,
    deviceRatio: taroConfig.deviceRatio,
    postcssOption: taroConfig.postcss,
  })

  async function getSassOption() {
    const sassLoaderOption = taroConfig.sassLoaderOption
    const nativeStyleImporter = function importer(url, prev, done) {
      // 让 sass 文件里的 @import 能解析小程序原生样式文体，如 @import "a.wxss";
      const extname = path.extname(url)
      // fix: @import 文件可以不带scss/sass缀，如: @import "define";
      if (extname === '.scss' || extname === '.sass' || extname === '.css' || !extname) {
        return null
      } else {
        const filePath = path.resolve(path.dirname(prev), url)
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (err) {
            logger.error(err.message)
            return null
          } else {
            fs.readFile(filePath)
              .then((res) => {
                done({ contents: res.toString() })
              })
              .catch((err) => {
                logger.error(err)
                return null
              })
          }
        })
      }
    }
    const importer = [nativeStyleImporter]
    if (sassLoaderOption?.importer) {
      isArray(sassLoaderOption.importer)
        ? importer.unshift(...sassLoaderOption.importer)
        : importer.unshift(sassLoaderOption.importer)
    }
    const option = {
      ...(await getSassLoaderOption(taroConfig)),
      ...sassLoaderOption,
      importer,
    }
    return {
      scss: option,
      sass: option,
    }
  }

  return {
    name: 'taro:vite-harmony-config',
    options(opt) {
      if (opt.plugins instanceof Array) {
        // Note: 移除冗余的 babel 插件，改用 runner 提供的版本
        const idx = opt.plugins.findIndex(e => e && (e as Plugin).name === 'vite:react-babel')
        if (idx >= 0) opt.plugins.splice(idx, 1)
      }
    },
    config: async () => {
      const output: OutputOptions = {
        entryFileNames(chunkInfo) {
          let name
          if (taroConfig.isBuildNativeComp || taroConfig.blended) {
            const pagePath = path.relative(taroConfig.sourceRoot || 'src', path.dirname(stripVirtualModulePrefix(chunkInfo.facadeModuleId || '')))
            if (chunkInfo.name.includes(pagePath)) {
              name = chunkInfo.name
            } else {
              name = path.join(pagePath, chunkInfo.name)
            }
          } else {
            name = chunkInfo.name
          }

          name = name.replace(/[\\/]+/g, '/')

          const appId = viteCompilerContext.app.config.appId || 'app'
          const isTaroComp = appId === name ||
            viteCompilerContext.pages.some((page: TaroHarmonyPageMeta) => [page.name, page.originName].includes(name)) ||
            viteCompilerContext.components?.some((comp: TaroHarmonyPageMeta) => [comp.name, comp.originName].includes(name))
          // 如果同时存在app.ets和app.js，因为鸿蒙IDE编译会把app.ets编译成app.ts，会跟app.js冲突，识别都是/app，导致app.js被app.ts覆盖了，所以需要名字
          const suffix = isTaroComp ? virtualModulePrefixREG.test(chunkInfo.facadeModuleId || '') ? TARO_COMP_SUFFIX : '_comp' : ''
          name = stripMultiPlatformExt(`${name}${suffix}`) + taroConfig.fileType.script

          if (chunkInfo.facadeModuleId && chunkInfo.facadeModuleId.includes(QUERY_IS_NATIVE_SCRIPT)) {
            name += QUERY_IS_NATIVE_SCRIPT
          }

          if (name.startsWith('.')) {
            name = name.replace(/^\.[.\\/]+/, '')
          }

          return name
        },
        chunkFileNames(chunkInfo) {
          if (chunkInfo.moduleIds?.some(id => id.includes(taroConfig.fileType.script))) {
            return `[name]${taroConfig.fileType.script}`
          }
          return '[name].js'
        },
        manualChunks(id, { getModuleInfo }) {
          if (taroConfig.isBuildNativeComp || taroConfig.blended) return
          const moduleInfo = getModuleInfo(id)
          const nodeModulesDirRegx = new RegExp(REG_NODE_MODULES_DIR)

          if (nodeModulesDirRegx.test(id) || /commonjsHelpers\.js$/.test(id)) {
            return 'vendors'
          } else if (moduleInfo?.importers?.length && moduleInfo.importers.length > 1 && !isVirtualModule(id)) {
            return 'common'
          }
        },
      }

      if (taroConfig.isWatch && !taroConfig.blended) {
        delete output.manualChunks
        output.preserveModules = true
        output.preserveModulesRoot = 'src'
        output.minifyInternalExports = false
        // Note: 修复虚拟模块的依赖和引用，使其能够正确的输出
        output.sanitizeFileName = (filename) => filename.replace(/^_virtual[\\/]/, '').replace(/[\0?*]/g, '_')
      }
      const rollupPlugins: InputPluginOption[] = [
        inject(getInjectOption()),
        babel(getBabelOption(
          taroConfig,
          {
            babelOption: {
              extensions: ['.js', '.jsx', '.ts', '.tsx', '.es6', '.es', '.mjs', '.mts', '.ets'],
            },
          }
        )),
        increment({
          force: (id) => /app\.config/.test(id),
          comparisonId: (id = '', files) => {
            const nodeModulesDirRegx = new RegExp(REG_NODE_MODULES_DIR)
            if (nodeModulesDirRegx.test(id)) return false

            const rawId = stripVirtualModulePrefix(id).replace(PAGE_SUFFIX, '')
            const etx = path.extname(rawId)
            id = etx ? rawId.replace(new RegExp(`${etx}$`), '') : rawId

            const list = Array.from(files)
            const rgx = new RegExp(`^${id}\\.config`)
            return list.some(file => rgx.test(file))
          },
        }),
      ]

      // Note: Vite 官方插件禁用了 es 输出模式下的 terser 插件，这里需要手动添加
      if (!taroConfig.isWatch && getMinify(taroConfig) === 'terser') {
        rollupPlugins.push(terser(recursiveMerge({}, DEFAULT_TERSER_OPTIONS, taroConfig.terser?.config || {})))
      }

      return {
        mode: getMode(taroConfig),
        build: {
          outDir: taroConfig.outputRoot || 'dist',
          target: 'esnext',
          cssCodeSplit: true,
          emptyOutDir: false,
          lib: {
            entry: getEntryOption(),
            formats: ['es'],
          },
          watch: taroConfig.isWatch ? {} : null,
          // TODO doc needed: sourcemapType not supported
          sourcemap: taroConfig.enableSourceMap ?? taroConfig.isWatch ?? process.env.NODE_ENV !== 'production',
          rollupOptions: {
            treeshake: !taroConfig.isWatch,
            external: HARMONY_SCOPES,
            makeAbsoluteExternalsRelative: 'ifRelativeSource',
            output: output as any,
            plugins: rollupPlugins,
          },
          commonjsOptions: {
            // TODO: 优化过滤
            extensions: ['.js', '.ts'],
            transformMixedEsModules: true,
          },
          minify: getMinify(taroConfig),
          terserOptions:
            getMinify(taroConfig) === 'terser'
              ? recursiveMerge({}, DEFAULT_TERSER_OPTIONS, taroConfig.terser?.config || {})
              : undefined,
        },
        define: getDefineOption(),
        resolve: {
          mainFields: [...defaultMainFields],
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.mts', '.vue', '.ets'],
          alias: [
            ...getAliasOption(),
          ],
          dedupe: ['@tarojs/shared', '@tarojs/runtime'],
        },
        esbuild: {
          jsxDev: false,
        },
        css: {
          postcss: {
            plugins: getPostcssPlugins(appPath, __postcssOption),
          },
          preprocessorOptions: {
            ...(await getSassOption()),
          },
          modules: getCSSModulesOptions(taroConfig),
        },
      }
    },
  }
}
