import { createRequire } from 'node:module'
import path from 'node:path'

import { transformSync } from '@babel/core'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import AsyncSubPackagePlugin from '../../taro-webpack5-runner/src/plugins/AsyncSubPackagePlugin'
import MiniPlugin from '../../taro-webpack5-runner/src/plugins/MiniPlugin'

const runnerRequire = createRequire(path.resolve(__dirname, '../../taro-webpack5-runner/package.json'))
const webpack = runnerRequire('webpack')
const testsRequire = createRequire(path.resolve(__dirname, '../../../tests/package.json'))
const { createFsFromVolume, Volume } = testsRequire('memfs')
const { SyncHook } = runnerRequire('tapable')
const fixtureDir = path.resolve(__dirname, 'fixtures/async-subpackage')
const filename = path.join(fixtureDir, 'entry.jsx')
const source = 'export const load = () => import("./async"); export const view = <view />'
const caller = {
  name: 'babel-loader',
  supportsStaticESM: true,
  supportsDynamicImport: true,
  supportsTopLevelAwait: true,
}
const originalGlobalFlag = Object.getOwnPropertyDescriptor(global, '__taroAsyncSubPackageUseWebpackImport')

function transform (options: any) {
  return transformSync(source, { ...options, filename, caller: { ...caller, ...options.caller } })!.code!
}

function createBuild (platform: string, asyncEnabled: boolean) {
  vi.stubEnv('TARO_ENV', platform)
  vi.stubEnv('TARO_PLATFORM', 'mini')
  const compiler = webpack({ context: fixtureDir, mode: 'none', optimization: { splitChunks: false } })
  let plugin: AsyncSubPackagePlugin | undefined
  if (asyncEnabled) {
    plugin = new AsyncSubPackagePlugin({
      options: { sourceDir: fixtureDir },
      hooks: { afterGenerateFiles: new SyncHook(['compilation']) },
    } as any, new Map([['pages/detail', 'async/detail']]))
    plugin.apply(compiler)
  }
  const params = compiler.newCompilationParams()
  const compilation = compiler.newCompilation(params)
  return {
    plugin,
    compilation,
    async resolve (options: any) {
      const data = {
        createData: {
          resource: filename,
          loaders: [{ loader: runnerRequire.resolve('babel-loader'), options }],
        },
      }
      await params.normalModuleFactory.hooks.afterResolve.promise(data)
      return data.createData.loaders[0].options
    },
  }
}

function configuredOptions () {
  return { configFile: path.join(fixtureDir, 'babel.config.js'), babelrc: false }
}

beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'production')
})

afterEach(() => {
  vi.unstubAllEnvs()
  if (originalGlobalFlag) {
    Object.defineProperty(global, '__taroAsyncSubPackageUseWebpackImport', originalGlobalFlag)
  } else {
    delete (global as any).__taroAsyncSubPackageUseWebpackImport
  }
})

async function compileBuild (platform: string, asyncEnabled: boolean, loaderOptions: any) {
  vi.stubEnv('TARO_ENV', platform)
  vi.stubEnv('TARO_PLATFORM', 'mini')
  const compiler = webpack({
    context: fixtureDir,
    mode: 'development',
    target: 'web',
    cache: false,
    devtool: false,
    entry: path.join(fixtureDir, 'entry.js'),
    output: { path: path.join(fixtureDir, 'output'), filename: 'main.js' },
    optimization: { minimize: false, splitChunks: false },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{ loader: runnerRequire.resolve('babel-loader'), options: loaderOptions }],
      }],
    },
  })
  // 编译产物只写入内存，不修改工作区或生成磁盘缓存。
  compiler.outputFileSystem = createFsFromVolume(new Volume())
  if (asyncEnabled) {
    new AsyncSubPackagePlugin({
      options: { sourceDir: fixtureDir, fileType: {} },
      hooks: { afterGenerateFiles: new SyncHook(['compilation']) },
    } as any, new Map([['pages/detail', 'async/detail']])).apply(compiler)
  }
  try {
    return await new Promise<number>((resolve, reject) => {
      compiler.run((error, stats) => {
        if (error) return reject(error)
        if (stats.hasErrors()) return reject(new Error(stats.toString({ all: false, errors: true })))
        resolve(stats.toJson({ all: false, chunks: true }).chunks.length)
      })
    })
  } finally {
    await new Promise<void>((resolve, reject) => compiler.close(error => error ? reject(error) : resolve()))
  }
}

describe('async subpackage Babel build isolation', () => {
  test('real sequential compilers emit an async chunk only for the async weapp build', async () => {
    const options = configuredOptions()
    expect(await compileBuild('weapp', true, options)).toBe(2)
    expect(await compileBuild('tt', false, options)).toBe(1)
    expect(await compileBuild('weapp', false, options)).toBe(1)
  })

  test.each(['tt', 'weapp'])('a %s build after an async weapp build still transforms import()', async platform => {
    const sharedOptions = configuredOptions()
    const asyncBuild = createBuild('weapp', true)
    const asyncOptions = await asyncBuild.resolve(sharedOptions)
    expect(transform(asyncOptions)).toContain('import("./async")')

    const nextBuild = createBuild(platform, false)
    const code = transform(await nextBuild.resolve(sharedOptions))
    expect(code).not.toContain('import("./async")')
    expect(code).toContain('require("./async")')
  })

  test('async builds clone preset options and preserve the project framework and module settings', async () => {
    const sharedPresetOptions = { framework: 'react', modules: false, targets: { node: 'current' }, 'dynamic-import-node': true }
    const sharedCaller = { name: 'custom-loader', customFlag: 'kept' }
    const sharedOptions = {
      caller: sharedCaller,
      babelrc: false,
      configFile: false,
      presets: [[require.resolve('../index.js'), sharedPresetOptions]],
    }
    const asyncBuild = createBuild('weapp', true)
    const resolvedOptions = await asyncBuild.resolve(sharedOptions)
    expect(resolvedOptions).not.toBe(sharedOptions)
    expect(sharedPresetOptions['dynamic-import-node']).toBe(true)
    expect(sharedCaller).toEqual({ name: 'custom-loader', customFlag: 'kept' })
    expect(resolvedOptions.caller).toMatchObject({ ...sharedCaller, taroAsyncSubPackage: true })
    const code = transform(resolvedOptions)
    expect(code).toContain('import("./async")')
    expect(code).toContain('export const')
    expect(code).not.toContain('<view')
  })

  test('a leftover legacy global flag cannot override an explicit normal-build option', () => {
    vi.stubEnv('TARO_ENV', 'tt')
    vi.stubEnv('TARO_PLATFORM', 'mini')
    ;(global as any).__taroAsyncSubPackageUseWebpackImport = true
    const code = transform({
      babelrc: false,
      configFile: false,
      presets: [[require.resolve('../index.js'), {
        framework: 'react', modules: false, targets: { node: 'current' }, 'dynamic-import-node': true,
      }]],
    })
    expect(code).toContain('require("./async")')
    expect(code).not.toContain('import("./async")')
  })

  test('the caller boolean partitions Babel preset caching across async and ordinary builds', () => {
    vi.stubEnv('TARO_ENV', 'weapp')
    vi.stubEnv('TARO_PLATFORM', 'mini')
    const options = configuredOptions()
    const asyncOptions = { ...options, caller: { taroAsyncSubPackage: true } }
    expect(transform(asyncOptions)).toContain('import("./async")')
    expect(transform(options)).toContain('require("./async")')
    expect(transform(asyncOptions)).toContain('import("./async")')
  })

  test('tt ignores an async caller marker even when the weapp preset was already cached', () => {
    vi.stubEnv('TARO_ENV', 'weapp')
    vi.stubEnv('TARO_PLATFORM', 'mini')
    const options = { ...configuredOptions(), caller: { taroAsyncSubPackage: true } }
    expect(transform(options)).toContain('import("./async")')
    vi.stubEnv('TARO_ENV', 'tt')
    expect(transform(options)).toContain('require("./async")')
  })

  test('the MiniPlugin bridge clears watch roots, Babel caller and app.json registration when roots disappear', async () => {
    vi.stubEnv('TARO_ENV', 'weapp')
    vi.stubEnv('TARO_PLATFORM', 'mini')
    const compiler = webpack({ context: fixtureDir, mode: 'none', optimization: { splitChunks: false } })
    const miniPlugin = Object.create(MiniPlugin.prototype) as MiniPlugin
    let roots = new Map([['pages/detail', 'async/detail']])
    let runtimeRoots = [{ sourceRoot: 'pages/detail', asyncRoot: 'async/detail' }]
    miniPlugin.options = { sourceDir: fixtureDir, fileType: { config: '.json' } } as any
    miniPlugin.hooks = { afterGenerateFiles: new SyncHook(['compilation']) } as any
    miniPlugin.appEntry = path.join(fixtureDir, 'app.js')
    miniPlugin.asyncSubPackagePlugin = null
    miniPlugin.subPackageIndiePlugin = {
      getAsyncSubPackageRootMap: () => roots,
      getAsyncSubPackageRuntimeRoots: () => runtimeRoots,
    } as any
    const configPath = miniPlugin.getConfigFilePath(miniPlugin.appEntry)
    const configName = path.basename(configPath, path.extname(configPath))
    const appJsonPath = miniPlugin.getConfigPath(configName)
    const regularPackage = { root: 'regular', pages: ['index'] }

    async function nextCompilation () {
      // watch 每次重新读取 app.config；不要把上轮生成的分包注册当作用户配置。
      miniPlugin.appConfig = { pages: ['pages/index'], subPackages: [{ ...regularPackage }] }
      miniPlugin.filesConfig = {
        [configName]: { content: { ...miniPlugin.appConfig } },
      } as any
      miniPlugin.applyAsyncSubPackagePlugin(compiler)
      const params = compiler.newCompilationParams()
      const compilation = compiler.newCompilation(params)
      compilation.assets[appJsonPath] = new webpack.sources.RawSource(JSON.stringify(miniPlugin.appConfig))
      const data = {
        createData: {
          resource: filename,
          loaders: [{ loader: runnerRequire.resolve('babel-loader'), options: configuredOptions() as any }],
        },
      }
      await params.normalModuleFactory.hooks.afterResolve.promise(data)
      miniPlugin.hooks.afterGenerateFiles.call(compilation)
      return {
        options: data.createData.loaders[0].options,
        appJson: JSON.parse(compilation.assets[appJsonPath].source().toString()),
      }
    }

    try {
      const first = await nextCompilation()
      const existingPlugin = miniPlugin.asyncSubPackagePlugin!
      expect(existingPlugin.asyncRootMap.size).toBe(1)
      expect(existingPlugin.asyncRuntimeRoots).toEqual(runtimeRoots)
      expect(first.options.caller?.taroAsyncSubPackage).toBe(true)
      expect(first.appJson.subPackages).toContainEqual({ root: 'async/detail', pages: ['index'], independent: false })

      roots = new Map()
      runtimeRoots = []
      const second = await nextCompilation()
      expect(miniPlugin.asyncSubPackagePlugin).toBe(existingPlugin)
      expect.soft(existingPlugin.asyncRootMap.size).toBe(0)
      expect.soft(existingPlugin.asyncRuntimeRoots).toEqual([])
      expect.soft(second.options.caller?.taroAsyncSubPackage).toBeUndefined()
      expect.soft(transform(second.options)).toContain('require("./async")')
      expect.soft(second.appJson.subPackages).toEqual([regularPackage])
      expect.soft(miniPlugin.appConfig.subPackages).toEqual([regularPackage])
    } finally {
      await new Promise<void>((resolve, reject) => compiler.close(error => error ? reject(error) : resolve()))
    }
  })

  test('clearing async roots stops injecting the option into subsequent modules', async () => {
    const build = createBuild('weapp', true)
    expect(transform(await build.resolve(configuredOptions()))).toContain('import("./async")')
    build.plugin!.updateAsyncRootMap(new Map())
    expect(transform(await build.resolve(configuredOptions()))).toContain('require("./async")')
  })
})
