const path = require('path')
const apis = require('@tarojs/taro-h5/dist/taroApis')

module.exports = (_, options = {}) => {
  const presets = []
  const plugins = []
  const isReact = options.framework === 'react'
  const isNerv = options.framework === 'nerv'
  const isVue = options.framework === 'vue'
  const isVue3 = options.framework === 'vue3'
  const moduleName = options.framework.charAt(0).toUpperCase() + options.framework.slice(1)

  if (isNerv || isReact) {
    presets.push([require('@babel/preset-react'), {
      pragma: `${moduleName}.createElement`,
      pragmaFrag: `${moduleName}.Fragment`
    }])
  }

  if (options.ts) {
    const config = {}
    if (isNerv || isReact) {
      config.jsxPragma = moduleName
    }
    if (isVue || isVue3) {
      config.allExtensions = true
    }
    presets.push([require('@babel/preset-typescript'), config])
  }

  const runtimePath = process.env.NODE_ENV === 'jest' || process.env.NODE_ENV === 'test' ? false : path.dirname(require.resolve('@babel/runtime/package.json'))
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
    version = runtimeVersion
  } = options

  // resolve targets
  let targets
  if (rawTargets) {
    targets = rawTargets
  } else if (ignoreBrowserslistConfig) {
    targets = { node: 'current' }
  } else {
    targets = {
      ios: '9',
      android: '5'
    }
  }

  const envOptions = {
    spec,
    loose,
    debug,
    modules,
    targets,
    useBuiltIns,
    ignoreBrowserslistConfig,
    configPath,
    include,
    exclude,
    shippedProposals,
    forceAllTransforms
  }

  if (useBuiltIns) {
    envOptions.corejs = 3
  }

  if (process.env.NODE_ENV === 'test') {
    envOptions.modules = 'commonjs'
  }

  presets.unshift([require('@babel/preset-env'), envOptions])

  plugins.push(
    [require('@babel/plugin-proposal-decorators'), {
      decoratorsBeforeExport,
      legacy: decoratorsLegacy !== false
    }],
    [require('@babel/plugin-proposal-class-properties'), { loose }]
  )

  plugins.push([require('@babel/plugin-transform-runtime'), {
    regenerator: true,
    corejs: envOptions.corejs,
    helpers: true,
    useESModules: process.env.NODE_ENV !== 'test',
    absoluteRuntime,
    version
  }])

  if (process.env.TARO_ENV === 'h5') {
    plugins.push([require('babel-plugin-transform-taroapi'), {
      packageName: '@tarojs/taro',
      apis
    }])
  } else {
    plugins.push([require('babel-plugin-dynamic-import-node')])
  }

  return {
    sourceType: 'unambiguous',
    overrides: [{
      exclude: [/@babel[/|\\\\]runtime/, /core-js/],
      presets,
      plugins
    }]
  }
}
