import { Adapters } from './adapter'
import { eslintValidation } from './eslint'
import { TransformOptions } from 'babel-core'

export interface Options {
  isRoot?: boolean,
  isApp: boolean,
  outputPath: string,
  sourcePath: string,
  code: string,
  isTyped: boolean,
  isNormal?: boolean,
  env?: object,
  adapter?: Adapters,
  jsxAttributeNameReplace?: Object
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
        'dynamicImport'
      ] as any[]
    },
    plugins: [
      require('babel-plugin-transform-flow-strip-types'),
      [require('babel-plugin-transform-define').default, transformOptions.env]
    ].concat(process.env.ESLINT === 'false' || transformOptions.isNormal || transformOptions.isTyped ? [] : eslintValidation)
    .concat((process.env.NODE_ENV === 'test') ? [] : require('babel-plugin-remove-dead-code').default)
  }
}
