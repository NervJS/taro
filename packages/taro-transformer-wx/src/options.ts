import { TransformOptions } from '@babel/core'

import { Adapters } from './adapter'
import { buildVistor } from './class-method-renamer'
import { isTestEnv } from './env'
import { eslintValidation } from './eslint'
import { functionalComponent, Status } from './functional'

export interface Options {
  isRoot?: boolean
  isApp?: boolean
  // outputPath: string,
  sourcePath: string
  sourceDir?: string
  code: string
  isTyped: boolean
  isNormal?: boolean
  env?: Object
  adapter?: Adapters
  jsxAttributeNameReplace?: Object
  rootProps?: object
}

export let transformOptions: Options = {} as Options

export const setTransformOptions = (options: Options) => {
  transformOptions = { ...options }
}

export const buildBabelTransformOptions: () => TransformOptions = () => {
  Status.isSFC = false
  let plugins = [
    require('babel-plugin-transform-do-expressions'),
    require('babel-plugin-transform-export-extensions'),
    require('babel-plugin-transform-flow-strip-types'),
    [require('babel-plugin-transform-define').default, transformOptions.env],
  ]
  if (!transformOptions.isNormal) {
    plugins.push(buildVistor())
  }
  return {
    filename: transformOptions.sourcePath,
    babelrc: false,
    parserOpts: {
      sourceType: 'module',
      plugins: [
        'classProperties',
        'jsx',
        'flow',
        'flowComment',
        'trailingFunctionCommas',
        'asyncFunctions',
        'exponentiationOperator',
        'asyncGenerators',
        'objectRestSpread',
        'decorators',
        'dynamicImport',
        'doExpressions',
        'exportExtensions',
      ] as any[],
    },
    plugins: plugins
      .concat(require('babel-plugin-preval'))
      .concat(process.env.TARO_ENV === 'rn' ? [] : functionalComponent)
      .concat(
        process.env.ESLINT === 'false' || transformOptions.isNormal || transformOptions.isTyped ? [] : eslintValidation
      )
      .concat(isTestEnv ? [] : require('babel-plugin-minify-dead-code').default),
  }
}
