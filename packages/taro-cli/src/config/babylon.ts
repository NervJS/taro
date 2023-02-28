import type { ParserOptions } from '@babel/parser'

const config: ParserOptions = {
  sourceType: 'module',
  plugins: [
    'typescript',
    'classProperties',
    'jsx',
    'asyncGenerators',
    'objectRestSpread',
    'decorators',
    'dynamicImport'
  ]
}

export default config
