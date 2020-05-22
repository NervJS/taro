import { ParserOptions } from '@babel/core'

export const parserOpts: ParserOptions = {
  sourceType: 'module',
  plugins: [
    'classProperties',
    'jsx',
    // 'trailingFunctionCommas', // babel7 removed
    // 'asyncFunctions',
    // 'exponentiationOperator',
    'asyncGenerators',
    'objectRestSpread',
    'decorators-legacy',
    'dynamicImport',
    'typescript',
    'doExpressions'
    // 'exportExtensions'
  ]
}
