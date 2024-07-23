import path from 'node:path'
import { fileURLToPath } from 'node:url'

import nodeResolve from '@rollup/plugin-node-resolve'

const __filename = fileURLToPath(new URL(import.meta.url))
const cwd = path.dirname(__filename)

const plugins = [
  nodeResolve({
    rootDir: path.join(cwd, '../..'),
    moduleDirectories: ['node_modules', 'packages'],
  }),
]

export default {
  input: 'src/index.js',
  external: [
    '@babel/plugin-syntax-jsx',
    '@babel/helper-module-imports',
    '@babel/types',
    'html-entities',
    'validate-html-nesting',
  ],
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    exports: 'auto',
  },
  plugins,
}
