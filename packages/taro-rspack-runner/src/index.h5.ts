/**
 * `@tarojs/rspack-runner` —— H5 平台 Rspack 构建入口（experimental）
 *
 * 签名对齐官方 runner:build(appPath, config)。
 *
 * 配置采用 rspack-chain 驱动:runner 构建基础 chain(命名 rule / plugin),
 * 在 toConfig() 前依次执行 modifyWebpackChain / webpackChain / modifyRspackChain /
 * onWebpackChainReady 四个钩子(第二参为 @rspack/core)。平台/框架插件的
 * alias、loaderMeta、额外 loader 规则均通过 modifyRspackChain 正向写入 chain
 * (参见 @tarojs/plugin-platform-h5 的 modifyRspackConfig()、@tarojs/plugin-framework-react
 * 的 rspack.h5.ts),用户自定义 modifyRspackChain / modifyWebpackChain 亦在此生效。
 *
 * Note: loaderMeta 落点为命名 rule 'taroEntry' 的 'taroLoader' use options,
 * 平台/框架插件通过 chain.module.rule('taroEntry').use('taroLoader').tap() 注入
 * —— 该 rule/use 命名是 runner 与插件之间的契约,改名需同步。
 *
 * 简化边界(初版):仅 production build;hash 单页;React;不含 prebundle / dev / HMR。
 */
import path from 'node:path'

import { rspack } from '@rspack/core'
import { RSPACK_H5_TARO_ENTRY_RULE, RSPACK_H5_TARO_LOADER_USE } from '@tarojs/helper'
import Config from 'rspack-chain'

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

  // loaderMeta 初始兜底值;平台/框架插件通过 modifyRspackChain 在此基础上补充字段
  // (见 chain.module.rule('taroEntry').use('taroLoader').tap(...))
  const loaderMeta = defaultLoaderMeta

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

  // 3) 用 rspack-chain 组装配置
  const chain = new Config()

  chain
    .mode('production')
    .context(appPath)
    .target(['web', 'es5'])
    // Note: 关闭 Rspack 内建 CSS 处理,统一走 CssExtractRspackPlugin + css-loader 链路
    .experiments({ css: false })

  chain.entry(entryFileName).add(appConfigEntry).end()

  chain.output
    .path(outputDir)
    .filename('js/[name].js')
    .chunkFilename('chunk/[name].js')
    .publicPath(publicPath)
    .clean(true)

  // Note: 平台后缀前置于裸后缀,使 foo.h5.tsx 优先于 foo.tsx 命中。
  // 已知限制:extensions 近似无法覆盖目录 index 平台变体(foo.h5/index)、
  // node_modules 包内平台解析 —— 完整多端解析需 rspack resolver 运行时机制,留待后续。
  chain.resolve.extensions.merge([
    '.h5.js', '.h5.jsx', '.h5.ts', '.h5.tsx',
    '.js', '.jsx', '.ts', '.tsx', '.mjs'
  ])

  // 命名 rule / use:loaderMeta 注入的契约落点(常量见 @tarojs/helper),
  // 平台(plugin-platform-h5)与框架(plugin-framework-react)插件通过
  // chain.module.rule(RSPACK_H5_TARO_ENTRY_RULE).use(RSPACK_H5_TARO_LOADER_USE).tap() 补充 loaderMeta 字段。
  chain.module
    .rule(RSPACK_H5_TARO_ENTRY_RULE)
    .test((filePath: string) => filePath === appConfigEntry)
    .use(RSPACK_H5_TARO_LOADER_USE)
    .loader(require.resolve('@tarojs/taro-loader/lib/h5', { paths: [appPath] }))
    .options(taroLoaderOptions)
    .end()
    .end()

  chain.module
    .rule('script')
    .test(/\.[tj]sx?$/)
    .exclude.add(/node_modules/).end()
    .use('swc')
    .loader('builtin:swc-loader')
    .options({
      jsc: {
        parser: { syntax: 'typescript', tsx: true },
        transform: {
          react: { runtime: 'automatic' }
        }
      }
    })
    .end()
    .end()

  chain.module
    .rule('style')
    .test(/\.(s[ac]ss|css)$/)
    // Note: opt out of Rspack 内建 CSS 管线,交给 CssExtractRspackPlugin.loader + css-loader,否则二者冲突。
    .type('javascript/auto')
    .use('cssExtract').loader(rspack.CssExtractRspackPlugin.loader).end()
    .use('css').loader(require.resolve('css-loader')).options({ importLoaders: 2, modules: false }).end()
    .use('postcss').loader(require.resolve('postcss-loader')).options({ postcssOptions: { plugins: postcssPlugins } }).end()
    .use('sass').loader(require.resolve('sass-loader')).options({
      implementation: require.resolve('sass'),
      sassOptions: { outputStyle: 'expanded' }
    }).end()
    .end()

  // Note: 插件统一用 (Ctor, [args]) 形式注册,不传已实例化对象 ——
  // rspack-chain 对已实例化插件后续无法 tap(args 数组为空)。
  chain.plugin('definePlugin').use(rspack.DefinePlugin, [definePluginOptions])
  chain.plugin('cssExtractPlugin').use(rspack.CssExtractRspackPlugin, [{ filename: 'css/[name].css' }])
  chain.plugin('htmlPlugin').use(rspack.HtmlRspackPlugin, [{
    template: path.join(sourceDir, 'index.html'),
    filename: 'index.html',
    // Note: Taro 模板用 <%= htmlWebpackPlugin.options.script %> 注入 pxtransform rem 脚本。
    // HtmlRspackPlugin 不自动提供该命名空间,需经 templateParameters 函数形式注入。
    templateParameters: (params: Record<string, any>) => ({
      ...params,
      htmlWebpackPlugin: { options: { script: htmlScript } }
    })
  }])

  // 4) 依次执行 chain 钩子(顺序对齐 webpack5-runner Combination:先 webpack 兼容层,
  // 再用户 webpackChain,再 rspack 专属钩子可覆盖修正,最后 ready 回调)。第二参传 rspack。
  // 不 try/catch:钩子内不兼容操作应让错误可见,而非静默失效。
  const chainData = {}
  await config.modifyWebpackChain?.(chain, rspack, chainData)
  await config.webpackChain?.(chain, rspack, chainData)
  await config.modifyRspackChain?.(chain, rspack, chainData)
  await config.onWebpackChainReady?.(chain, rspack, chainData)

  const rspackConfig = chain.toConfig()

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
