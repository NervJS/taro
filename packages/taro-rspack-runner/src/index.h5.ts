/**
 * `@tarojs/rspack-runner` —— H5 平台 Rspack 构建入口（experimental）
 *
 * 签名对齐官方 runner:build(appPath, config)。
 *
 * alias / loaderMeta / extraRules 由 `@tarojs/plugin-platform-h5` 与
 * `@tarojs/plugin-framework-react` 通过 `modifyRunnerOpts` hook 写入
 * `config.runnerInject`（参见两个插件 src/index.ts 中的 `ctx.modifyRunnerOpts` 实现），
 * 而不是像 webpack5-runner 那样依赖 webpack-chain 的闭包副作用。
 *
 * 简化边界(初版):仅 production build;hash 单页;React;不含 prebundle / dev / HMR。
 */
import path from 'node:path'

import { rspack } from '@rspack/core'

import AppHelper from './vendor/app-helper'
import { getDefaultPostcssConfig, getPostcssPlugins } from './vendor/postcss.h5'

import type { ILoaderMeta } from '@tarojs/taro/types/compile/config/plugin'

const defaultLoaderMeta: ILoaderMeta = {
  creator: 'createReactApp',
  creatorLocation: '',
  importFrameworkStatement: '',
  frameworkArgs: '',
  importFrameworkName: 'React',
  extraImportForWeb: '',
  execBeforeCreateWebApp: '',
  mockAppStatement: ''
}

/**
 * 生成 pxtransform 运行时 rem 脚本(targetUnit 为 rem 时按视口设置根字号)。
 * 复刻自 @tarojs/webpack5-runner H5WebpackPlugin.getHtmlWebpackPlugin()。
 */
function buildPxtransformScript (options: any = {}): string {
  if ((options?.targetUnit ?? 'rem') !== 'rem') return ''
  const max = options?.maxRootSize ?? 40
  const min = options?.minRootSize ?? 20
  const baseFontSize = options?.baseFontSize || (min > 1 ? min : 20)
  const designWidth = typeof options.designWidth === 'function'
    ? options.designWidth(baseFontSize)
    : options.designWidth
  const deviceRatio = options.deviceRatio || {}
  const ratio = deviceRatio[designWidth]
  if (!ratio || !designWidth) return ''
  const rootValue = baseFontSize / ratio * 2
  return `!function(n){function f(){var e=n.document.documentElement,r=e.getBoundingClientRect(),width=r.width,height=r.height,arr=[width,height].filter(function(value){return Boolean(value)}),w=Math.min.apply(Math,arr),x=${rootValue}*w/${designWidth};e.style.fontSize=x>=${max}?"${max}px":x<=${min}?"${min}px":x+"px"}; n.addEventListener("resize",(function(){f();setTimeout(f,500)})),f()}(window);`
}

export default async function build (appPath: string, config: any): Promise<void> {
  const sourceRoot = config.sourceRoot || 'src'
  const outputRoot = config.outputRoot || 'dist'
  const entryFileName = config.entryFileName || 'app'
  const sourceDir = path.join(appPath, sourceRoot)
  const outputDir = path.join(appPath, outputRoot)
  const framework = config.framework || 'react'
  const publicPath = config.publicPath || '/'
  const designWidth = config.designWidth || 750
  const deviceRatio = config.deviceRatio

  // 1) 读取 modifyRunnerOpts 阶段收集到的 alias / loaderMeta / extraRules
  const { alias = {}, loaderMeta = defaultLoaderMeta, extraRules = [] } = config.runnerInject || {}

  // 2) AppHelper 计算 app.config / pages
  const app = new AppHelper(config.entry || {}, {
    sourceDir,
    entryFileName,
    frameworkExts: config.frameworkExts,
    alias: config.alias,
    defineConstants: config.defineConstants,
    modifyAppConfig: config.modifyAppConfig
  })
  const appConfig = app.appConfig
  const appEntryPath = app.appEntry
  // taro-loader/h5 的 pages 需为 [pageName, pageConfigPath][]:
  // 其内部 new Map(pages) 后在 genResource 中 readConfig(map.get(pageName)),
  // 期望取到页面的 .config 路径(而非页面主文件),否则 esbuild 会误 bundle 页面源码。
  const pages: [string, string][] = []
  app.pagesConfigList.forEach((configPath, name) => pages.push([name, configPath]))

  // taro-loader/h5 需要的 pxTransformConfig:从 getDefaultPostcssConfig 的
  // postcss-pxtransform 项抽取,保证与 PostCSS 规则同源。
  const postcssConfigList = getDefaultPostcssConfig({
    designWidth,
    deviceRatio,
    option: config.h5?.postcss || config.postcss,
    alias: config.alias
  })
  const pxtransformEntry = postcssConfigList.find(([name]) => name === 'postcss-pxtransform')
  const pxTransformConfig = (pxtransformEntry?.[1]?.config) || { designWidth }

  // pxtransform 运行时 rem 脚本,注入 HTML <head>。复刻自
  // @tarojs/webpack5-runner H5WebpackPlugin.getHtmlWebpackPlugin(),用于 targetUnit=rem 时按视口设置根字号。
  const htmlScript = buildPxtransformScript(pxTransformConfig)

  const runtimePath = config.runtimePath || ['@tarojs/plugin-platform-h5/dist/runtime']

  const taroLoaderOptions = {
    entryFileName,
    filename: entryFileName,
    sourceDir,
    runtimePath,
    config: {
      router: config.router || { mode: 'hash' },
      ...appConfig
    },
    framework,
    loaderMeta,
    pages,
    pxTransformConfig,
    alias: config.alias || {},
    defineConstants: config.defineConstants || {},
    noInjectGlobalStyle: !!config.noInjectGlobalStyle,
    bootstrap: false,
    isBuildNativeComp: false
  }

  // 3) 组装 Rspack config
  const appConfigEntry = app.getConfigFilePath(appEntryPath)
  const postcssPlugins = getPostcssPlugins(appPath, postcssConfigList)

  const env = config.env || {}
  const defineConstants = config.defineConstants || {}
  const definePluginOptions: Record<string, string> = {
    'process.env.FRAMEWORK': env.FRAMEWORK || JSON.stringify(framework),
    'process.env.TARO_ENV': env.TARO_ENV || JSON.stringify('h5'),
    'process.env.TARO_PLATFORM': env.TARO_PLATFORM || JSON.stringify('web'),
    'process.env.TARO_VERSION': env.TARO_VERSION || JSON.stringify(''),
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.SUPPORT_TARO_POLYFILL': JSON.stringify('disabled'),
    'process.env.SUPPORT_DINGTALK_NAVIGATE': JSON.stringify('disabled'),
    // @tarojs/components-react 的 createReactComponent 会读取该常量,缺失将导致 ReferenceError
    DEPRECATED_ADAPTER_COMPONENT: JSON.stringify(!!config.h5?.useDeprecatedAdapterComponent),
    ...Object.keys(env).reduce((acc: Record<string, string>, key) => {
      acc[`process.env.${key}`] = env[key]
      return acc
    }, {}),
    ...Object.keys(defineConstants).reduce((acc: Record<string, string>, key) => {
      acc[key] = defineConstants[key]
      return acc
    }, {})
  }

  const rspackConfig = {
    mode: 'production' as const,
    context: appPath,
    target: ['web', 'es5'] as ['web', 'es5'],
    // Note: 关闭 Rspack 内建 CSS 处理,统一走 CssExtractRspackPlugin + css-loader 链路
    experiments: { css: false },
    entry: {
      [entryFileName]: [appConfigEntry]
    },
    output: {
      path: outputDir,
      filename: 'js/[name].js',
      chunkFilename: 'chunk/[name].js',
      publicPath,
      clean: true
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
      alias
    },
    module: {
      rules: [
        {
          test: (filePath: string) => filePath === appConfigEntry,
          use: [
            {
              loader: require.resolve('@tarojs/taro-loader/lib/h5', { paths: [appPath] }),
              options: taroLoaderOptions
            }
          ]
        },
        {
          test: /\.[tj]sx?$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'builtin:swc-loader',
              options: {
                jsc: {
                  parser: { syntax: 'typescript', tsx: true },
                  transform: {
                    react: { runtime: 'automatic' }
                  }
                }
              }
            }
          ]
        },
        {
          test: /\.(s[ac]ss|css)$/,
          // Note: opt out of Rspack 内建 CSS 管线,交给 CssExtractRspackPlugin.loader + css-loader,
          // 否则二者冲突。见 rspack CssExtractRspackPlugin 用法。
          type: 'javascript/auto',
          use: [
            rspack.CssExtractRspackPlugin.loader,
            { loader: require.resolve('css-loader'), options: { importLoaders: 2, modules: false } },
            {
              loader: require.resolve('postcss-loader'),
              options: { postcssOptions: { plugins: postcssPlugins } }
            },
            {
              loader: require.resolve('sass-loader'),
              options: {
                implementation: require.resolve('sass'),
                sassOptions: { outputStyle: 'expanded' }
              }
            }
          ]
        },
        // 由 modifyRunnerOpts 收集的额外规则(如 framework-react 的 api-loader,
        // 向 @tarojs/taro 注入 useLaunch/useLoad 等 React hooks)
        ...extraRules
      ]
    },
    plugins: [
      new rspack.DefinePlugin(definePluginOptions),
      new rspack.CssExtractRspackPlugin({ filename: 'css/[name].css' }),
      new rspack.HtmlRspackPlugin({
        template: path.join(sourceDir, 'index.html'),
        filename: 'index.html',
        // Note: Taro 模板用 <%= htmlWebpackPlugin.options.script %> 注入 pxtransform rem 脚本。
        // HtmlRspackPlugin 不自动提供该命名空间,需经 templateParameters 函数形式注入。
        templateParameters: (params: Record<string, any>) => ({
          ...params,
          htmlWebpackPlugin: { options: { script: htmlScript } }
        })
      })
    ]
  }

  await new Promise<void>((resolve, reject) => {
    rspack(rspackConfig, (err: Error | null, stats: any) => {
      if (err) {
        console.error(err)
        return reject(err)
      }
      if (stats?.hasErrors()) {
        console.error(stats.toString({ colors: true, chunks: false }))
        return reject(new Error('[rspack-runner] 构建失败'))
      }
      console.log(stats.toString({ colors: true, chunks: false, modules: false }))
      resolve()
    })
  })
}
