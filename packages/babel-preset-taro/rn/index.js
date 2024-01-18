const reactNativeBabelPreset = require('metro-react-native-babel-preset')

module.exports = (_, options = {
  redirectPackagesImportPaths: true
}) => {
  const {
    decoratorsBeforeExport,
    decoratorsLegacy
  } = options
  if (options.framework && !['react', 'preact'].includes(options.framework)) {
    throw new Error(`Value "${options.framework}" of option "framework" is not supported for React-Native`)
  }

  // taro-rn api/lib 支持按需引入
  const nativeApis = require('@tarojs/taro-rn/apiList.js')
  const nativeLibs = require('@tarojs/taro-rn/libList.js')
  const nativeInterfaces = nativeApis.concat(nativeLibs)

  const presets = []
  const plugins = []

  presets.push(reactNativeBabelPreset(_, options))

  // 默认重新指向包路径
  // @tarojs/taro => @tarojs/taro-rn
  // @tarojs/component => @tarojs/component-rn
  if (options.redirectPackagesImportPaths) {
    plugins.push(
      [require('babel-plugin-transform-imports-api').default, {
        packagesApis: new Map([
          ['@tarojs/taro', new Set(nativeInterfaces)],
          ['@tarojs/taro-rn', new Set(nativeInterfaces)]
        ]),
        usePackgesImport: true, // Whether to use packagesImport
        packagesImport: {
          '^@tarojs/components(-rn)?$': {
            transform: '@tarojs/components-rn/dist/components/${member}'
          },
          '^@tarojs/taro(-rn)?$': {
            transform: (importName) => {
              if (nativeLibs.includes(importName)) {
                return `@tarojs/taro-rn/dist/lib/${importName}`
              } else {
                return '@tarojs/taro-rn/dist/api'
              }
            },
            skipDefaultConversion: true
          }
        }
      }],
    )
  }


  plugins.push(
    [require('@babel/plugin-proposal-decorators'), {
      decoratorsBeforeExport,
      legacy: decoratorsLegacy !== false
    }]
  )

  plugins.push(require('../remove-define-config'))

  plugins.push(
    [require('babel-plugin-minify-dead-code-elimination'), {}]
  )

  return {
    presets,
    plugins
  }
}
