import babel from '@rollup/plugin-babel'
import * as commonjs from '@rollup/plugin-commonjs'
import * as json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import * as pluginReplace from '@rollup/plugin-replace'
import { recursiveMerge } from '@tarojs/helper'
import { rollupTransform as styleTransformer } from '@tarojs/rn-style-transformer'
import { getBabelConfig, resolveExtFile, rollupResolver as taroResolver } from '@tarojs/rn-supporter'
import { getAppConfig } from '@tarojs/rn-transformer'
import * as jsx from 'acorn-jsx'
import * as path from 'path'
import { rollup, RollupOptions } from 'rollup'
import image from 'rollup-plugin-image-file'

type ExternalFn = (arr: Array<string | RegExp>) => Array<string | RegExp>

interface IComponentConfig {
  input: string[] | string
  output?: string
  sourceRootPath?: string
  external?: Array<string | RegExp> | ExternalFn
  externalResolve?: (importee, importer) => string | null | void
  modifyRollupConfig?: (
    config: RollupOptions,
    innerplugins?: [typeof taroResolver, typeof styleTransformer]
  ) => RollupOptions
}

const DEFAULT_CONFIG: Pick<
IComponentConfig,
'external' | 'output' | 'externalResolve' | 'sourceRootPath' | 'modifyRollupConfig'
> = {
  external: [/^react(\/.*)?$/, /^react-native(\/.*)?$/, /^@react-native/],
  output: 'dist',
  externalResolve: importee => (likeDependent(importee) ? importee : null),
  sourceRootPath: process.cwd(),
  modifyRollupConfig: config => config
}

export const build = async (projectConfig, componentConfig: IComponentConfig) => {
  const mergedConfig = recursiveMerge({ ...DEFAULT_CONFIG }, componentConfig)
  const { input, external, output, externalResolve, sourceRootPath, modifyRollupConfig } = mergedConfig

  const getInputOption = () => {
    const components: string[] = Array.isArray(input) ? input : [input]

    const inputOptions = components.reduce((pre, cur) => {
      let absolutePath = cur
      if (!path.isAbsolute(cur)) {
        absolutePath = path.resolve(sourceRootPath, cur)
      }
      const realPath = resolveExtFile({ originModulePath: absolutePath }, absolutePath, undefined, projectConfig)
      const relativePath = path
        .relative(sourceRootPath, realPath)
        .replace(/\.(js|ts|jsx|tsx)$/, '')
        .replace(/\.{1,}\//g, '')

      return {
        ...pre,
        [relativePath]: realPath
      }
    }, {})
    if (components.length === 1) {
      return {
        index: Object.values(inputOptions)[0]
      }
    }
    return inputOptions
  }

  const getExternal = () => {
    if (typeof external === 'function') {
      return external(DEFAULT_CONFIG.external)
    }
    const _external = Array.isArray(external) ? external : [external]
    return _external.filter(Boolean).map(item => {
      if (((item as unknown) as RegExp).test) return item
      const match = (item as string).match(/^\/(.+)\/$/)
      return match ? new RegExp(match[1]) : item
    })
  }

  const { plugins } = getBabelConfig(projectConfig, true)

  const rollupOptions: RollupOptions = {
    input: getInputOption(),
    output: {
      format: 'es',
      dir: output
    },
    external: getExternal(),
    // @ts-ignore react native 相关的一些库中可能包含 jsx 语法
    acornInjectPlugins: [jsx()],
    plugins: [
      // TODO: 使用 react-native-svg-transformer 处理
      // @ts-ignore
      image({
        extensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.svgx']
      }),
      // @ts-ignore
      json(),
      taroResolver({
        externalResolve,
        platform: projectConfig.deviceType // ios|android
      }, projectConfig),
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx']
      }),
      // @ts-ignore
      pluginReplace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      // @ts-ignore
      commonjs(),
      babel({
        babelHelpers: 'runtime',
        presets: [
          [
            'babel-preset-taro',
            {
              framework: 'react',
              ts: true,
              reactJsxRuntime: projectConfig.reactJsxRuntime || 'automatic',
              disableImportExportTransform: true
            }
          ]
        ],
        plugins,
        extensions: ['js', 'ts', 'jsx', 'tsx']
      }),
      styleTransformer({
        platform: projectConfig.deviceType,
        config: {
          designWidth: projectConfig.designWidth,
          deviceRatio: projectConfig.deviceRatio,
          // TODO: config.ass 和 rn.sass 命名重复，合并导致 global sass 丢失了，rn config sass 考虑更换字段，比如 sassOption.
          // sass: projectConfig.sass,
          alias: projectConfig.alias,
          rn: {
            postcss: projectConfig.postcss,
            sass: projectConfig.sass,
            less: projectConfig.less,
            stylus: projectConfig.stylus
          }
        },
      })
    ]
  }

  const newRollupOptions = modifyRollupConfig(rollupOptions, {
    taroResolver,
    styleTransformer
  })
  const { output: outputOptions, ...inputOptions } = newRollupOptions

  let bundle
  try {
    bundle = await rollup(inputOptions)

    const result = await bundle.write(outputOptions)
    return result
  } catch (error) {
    console.error(error)
  }
  if (bundle) {
    await bundle.close()
  }
}

function likeDependent (str: string) {
  return !str.match(/^\.?\.\//) && !path.isAbsolute(str)
}

function getEntryPath (entry) {
  const app = entry.app
  if (Array.isArray(app)) {
    return app[0]
  } else if (Array.isArray(app.import)) {
    return app.import[0]
  }
  return app
}

export default function (projectPath: string, config: any) {
  const { sourceRoot, entry, nativeComponents } = config
  const appEntryPath = getEntryPath(entry)
  const appConfig = getAppConfig(appEntryPath)
  const { output = DEFAULT_CONFIG.output } = nativeComponents || {}

  const componentConfig = {
    ...nativeComponents,
    input: appConfig?.components,
    output: path.join(projectPath, output),
    sourceRootPath: path.join(projectPath, sourceRoot)
  }

  return build(config, componentConfig)
}
