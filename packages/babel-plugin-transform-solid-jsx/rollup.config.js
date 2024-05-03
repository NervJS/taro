import nodeResolve from '@rollup/plugin-node-resolve'
import path from 'path'

const plugins = [
  nodeResolve({
    rootDir: path.join(process.cwd(), '../..'),
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
