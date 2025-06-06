const path = require('path')

function hasBrowserslist() {
  const fs = require('@tarojs/helper').fs
  const root = process.cwd()
  try {
    const pkg = require(path.resolve(root, 'package.json'))
    if (pkg.browserslist) {
      return true
    }
  } catch {
    //
  }
  if (fs.existsSync(path.resolve(root, '.browserslistrc'))) {
    return true
  }
  if (process.env.BROWSERSLIST) {
    return true
  }
  return false
}

module.exports = (_, options = {}) => {
  if (process.env.TARO_ENV === 'rn') {
    const presetForReactNative = require('./rn')
    return presetForReactNative(_, options)
  }
  const presets = []
  const plugins = []
  const overrides = []
  const isVite = options.compiler === 'vite'
  // vite 不需要 react 的 preset，在内部已经处理了
  const isReact = options.framework === 'react' || options.framework === 'preact' && !isVite
  // vite 不需要 solid 的 preset，在内部已经处理了
  const isSolid = options.framework === 'solid' && !isVite
  // vite 不需要 vue 的 preset，在内部已经处理了
  const isVue3 = options.framework === 'vue3' && !isVite
  // TODO：后续改为在 vite harmony 中实现对 ts 的支持
  const isHarmony = process.env.TARO_PLATFORM === 'harmony'
  // vite 不需要使用 babel 处理 ts，在 esbuild 中处理了
  const isTs = options.ts && (!isVite || isHarmony)
  const moduleName = options.framework.charAt(0).toUpperCase() + options.framework.slice(1)
  const presetReactConfig = options.react || {}

  if (isReact) {
    presets.push([
      require('@babel/preset-react'),
      {
        runtime: options.reactJsxRuntime || 'automatic',
        ...presetReactConfig,
      },
    ])
    if (process.env.TARO_PLATFORM === 'web' && process.env.NODE_ENV !== 'production' && options.hot !== false) {
      if (options.framework === 'react') {
        plugins.push([require('react-refresh/babel'), { skipEnvCheck: true }])
      } else if (options.framework === 'preact') {
        overrides.push({
          include: /\.[jt]sx$/,
          plugins: [require('@prefresh/babel-plugin')],
        })
      }
    }
  } else if (isSolid) {
    const solidOptions = {}
    if (process.env.TARO_PLATFORM !== 'web') {
      Object.assign(solidOptions, {
        moduleName: '@tarojs/plugin-framework-solid/dist/reconciler',
        generate: 'universal',
        uniqueTransform: true,
      })
    }
    presets.push([
      require('babel-plugin-transform-solid-jsx'),
      solidOptions,
    ])
  }

  if (isVue3) {
    if (options.vueJsx !== false) {
      const jsxOptions = typeof options.vueJsx === 'object' ? options.vueJsx : {}
      plugins.push([require('@vue/babel-plugin-jsx'), jsxOptions])
    }
  }

  if (isTs) {
    const config = typeof options.ts === 'object' ? options.ts : {}
    if (isReact) {
      config.jsxPragma = moduleName
    }
    if (isVue3) {
      overrides.push({
        include: /\.vue$/,
        presets: [[require('@babel/preset-typescript'), { allExtensions: true, isTSX: true }]],
      })
    }
    presets.push([require('@babel/preset-typescript'), config])
  }

  const runtimePath =
    process.env.NODE_ENV === 'jest' || process.env.NODE_ENV === 'test'
      ? false
      : path.dirname(require.resolve('@babel/runtime/package.json'))
  const runtimeVersion = require('@babel/runtime/package.json').version
  const {
    loose = false,
    debug = false,
    useBuiltIns = false,
    modules = false,
    targets: rawTargets,
    spec,
    ignoreBrowserslistConfig = process.env.NODE_ENV === 'test',
    configPath,
    include,
    exclude,
    shippedProposals,
    forceAllTransforms,
    decoratorsBeforeExport,
    decoratorsLegacy,
    // entry file list
    // Undocumented option of @babel/plugin-transform-runtime.
    // When enabled, an absolute path is used when importing a runtime helper after transforming.
    // This ensures the transpiled file always use the runtime version required in this package.
    // However, this may cause hash inconsistency if the project is moved to another directory.
    // So here we allow user to explicit disable this option if hash consistency is a requirement
    // and the runtime version is sure to be correct.
    absoluteRuntime = runtimePath,

    // https://babeljs.io/docs/en/babel-plugin-transform-runtime#version
    // By default transform-runtime assumes that @babel/runtime@7.0.0-beta.0 is installed, which means helpers introduced later than 7.0.0-beta.0 will be inlined instead of imported.
    // See https://github.com/babel/babel/issues/10261
    // And https://github.com/facebook/docusaurus/pull/2111
    version = runtimeVersion,
  } = options

  // resolve targets
  let targets
  if (rawTargets) {
    targets = rawTargets
  } else if (ignoreBrowserslistConfig) {
    targets = { node: 'current' }
  } else if (!hasBrowserslist()) {
    targets = {
      ios: '9',
      android: '5',
    }
  }

  const envOptions = {
    spec,
    loose,
    debug,
    modules,
    targets,
    ignoreBrowserslistConfig,
    configPath,
    include,
    exclude,
    shippedProposals,
    forceAllTransforms,
  }

  let transformRuntimeCorejs = false
  if (useBuiltIns === 'usage') {
    transformRuntimeCorejs = 3
  } else {
    envOptions.useBuiltIns = useBuiltIns
    if (useBuiltIns === 'entry') {
      envOptions.corejs = '3'
    }
  }

  if (process.env.NODE_ENV === 'test') {
    envOptions.modules = 'commonjs'
  }

  presets.unshift([require('@babel/preset-env'), envOptions])

  plugins.push(
    [
      require('@babel/plugin-proposal-decorators'),
      {
        decoratorsBeforeExport,
        legacy: decoratorsLegacy !== false,
      },
    ],
    [require('@babel/plugin-transform-class-properties'), { loose }]
  )

  plugins.push([
    require('@babel/plugin-transform-runtime'),
    {
      regenerator: true,
      corejs: transformRuntimeCorejs,
      helpers: true,
      useESModules: process.env.NODE_ENV !== 'test',
      absoluteRuntime,
      version,
    },
  ])

  if (
    typeof options['dynamic-import-node'] === 'boolean'
      ? options['dynamic-import-node']
      : process.env.TARO_PLATFORM !== 'web'
  ) {
    plugins.push([require('babel-plugin-dynamic-import-node')])
  }

  plugins.push(require('./remove-define-config'))
  if (isReact) {
    plugins.unshift(require('./transform-taro-components'))
  }

  return {
    sourceType: 'unambiguous',
    overrides: [
      {
        exclude: [/@babel[/|\\\\]runtime/, /core-js/, /\bwebpack\/buildin\b/],
        presets,
        plugins,
      },
      ...overrides,
    ],
  }
}
