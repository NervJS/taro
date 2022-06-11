import babel from '@rollup/plugin-babel'
import * as commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import { rollupTransform as styleTransformer } from '@tarojs/rn-style-transformer'
import { resolveExtFile, rollupResolver as taroResolver } from '@tarojs/rn-supporter'
import { getAppConfig } from '@tarojs/rn-transformer'
import { merge } from 'lodash'
import * as path from 'path'
import { rollup } from 'rollup'
import * as clear from 'rollup-plugin-clear'
import image from 'rollup-plugin-image-file'

const DefaultConfig = {
  externals: [
    'react',
    'react-native'
  ],
  output: 'dist',
  externalResolve: () => {}
}

export const build = async (projectConfig, componentConfig: ComponentConfig) => {
  const mergedConfig = merge(DefaultConfig, componentConfig)
  const { input, externals, output, externalResolve } = mergedConfig
  let { sourceRootPath } = componentConfig

  sourceRootPath = sourceRootPath || process.cwd()
  const getInputOption = () => {
    const components: string[] = Array.isArray(input) ? input : [input]

    const inputOptions = components.reduce((pre, cur) => {
      let absolutePath = cur
      if (!path.isAbsolute(cur)) {
        absolutePath = path.resolve(sourceRootPath, cur)
      }
      const realPath = resolveExtFile({ originModulePath: absolutePath }, absolutePath)
      const relativePath = path.relative(sourceRootPath, realPath).replace(/\.(js|ts|jsx|tsx)$/, '')

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
    let _externals = externals
    if (typeof _externals === 'function') {
      return (_externals as ExternalsFn)()
    }
    _externals = Array.isArray(externals) ? externals : [externals]
    return _externals.filter(Boolean).map(item => {
      if ((item as unknown as RegExp).test) return item
      const match = (item as string).match(/^\/(.+)\/$/)
      return match ? new RegExp(match[1]) : item
    })
  }

  const bundle = await rollup({
    input: getInputOption(),
    external: getExternal(),
    plugins: [
      clear({ targets: [output] }),
      // @ts-ignore
      image({
        extensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
      }),
      taroResolver({
        externalResolve
      }),
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx']
      }),
      // @ts-ignore
      commonjs({
        include: [/node_modules/, /src/, '*'],
        transformMixedEsModules: true,
        requireReturnsDefault: 'auto'
      }),
      babel({
        babelHelpers: 'runtime',
        presets: [[
          'babel-preset-taro',
          {
            framework: 'react',
            ts: true,
            reactJsxRuntime: projectConfig.reactJsxRuntime || 'classic',
            disableImportExportTransform: true
          }
        ]],
        extensions: ['js', 'ts', 'jsx', 'tsx']
      }),
      styleTransformer({ format: 'es', config: projectConfig })
    ]
  })
  const result = await bundle.write({ dir: output })
  return result
}

type ExternalsFn = () => Array<string | RegExp>

interface ComponentConfig {
  input: string[] | string
  output: string
  externals: Array<string | RegExp> | ExternalsFn
  externalResolve: (importee, importer) => string | void,
  sourceRootPath: string
}

export default async function (projectPath: string, config: any) {
  const { sourceRoot, entry, nativeComponents } = config
  const appPath = path.join(projectPath, sourceRoot, entry)
  const appConfig = getAppConfig(appPath)
  const { output = DefaultConfig.output } = nativeComponents || {}

  const componentConfig = {
    ...nativeComponents,
    input: appConfig.components,
    output: path.join(projectPath, output),
    sourceRootPath: path.join(projectPath, sourceRoot)
  }

  return build(config, componentConfig)
}
