import { Adapters } from './adapter'
import { eslintValidation } from './eslint'
import { TransformOptions } from 'babel-core'
import { functionalComponent, Status } from './functional'
import { isTestEnv } from './env'
import { buildVistor } from './class-method-renamer'

export interface Options {
  isRoot?: boolean,
  isApp: boolean,
  outputPath: string,
  sourcePath: string,
  sourceDir?: string,
  code: string,
  isTyped: boolean,
  isNormal?: boolean,
  env?: object,
  adapter?: Adapters,
  jsxAttributeNameReplace?: Object,
  rootProps?: object
}

export const transformOptions: Options = {} as any

export const setTransformOptions = (options: Options) => {
  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      transformOptions[key] = options[key]
    }
  }
}

export const buildBabelTransformOptions: () => TransformOptions = () => {
  Status.isSFC = false
  let plugins = [
    require('babel-plugin-transform-do-expressions'),
    require('babel-plugin-transform-export-extensions'),
    require('babel-plugin-transform-flow-strip-types'),
    buildVistor(),
    functionalComponent,
    [require('babel-plugin-transform-define').default, transformOptions.env]
  ]
  if (!transformOptions.isNormal) {
    plugins.push(buildVistor(), functionalComponent)
  }
  return {
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
        'exportExtensions'
      ] as any[]
    },
    plugins: plugins.concat(process.env.ESLINT === 'false' || transformOptions.isNormal || transformOptions.isTyped ? [] : eslintValidation)
    .concat((isTestEnv) ? [] : require('babel-plugin-remove-dead-code').default)
  }
}
