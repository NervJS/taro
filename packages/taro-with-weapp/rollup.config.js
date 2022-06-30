import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import * as path from 'path'
import ts from 'rollup-plugin-ts'

const cwd = __dirname

const baseConfig = {
  input: path.join(cwd, 'src/index.ts'),
  external: d => {
    return d.includes('@tarojs/runtime') || d.includes('@tarojs/taro') || d.includes('@babel/runtime')
  },
  output: [
    {
      file: path.join(cwd, 'dist/index.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: path.join(cwd, 'dist/with-weapp.js'),
      format: 'umd',
      name: 'TaroWithWeapp',
      sourcemap: true,
      exports: 'named',
      globals: {
        '@babel/runtime/helpers/defineProperty': '_defineProperty',
        '@babel/runtime/helpers/toConsumableArray': '_toConsumableArray',
        '@babel/runtime/helpers/slicedToArray': '_slicedToArray',
        '@babel/runtime/helpers/classCallCheck': '_classCallCheck',
        '@babel/runtime/helpers/createClass': '_createClass',
        '@babel/runtime/helpers/assertThisInitialized': '_assertThisInitialized',
        '@babel/runtime/helpers/get': '_get',
        '@babel/runtime/helpers/inherits': '_inherits',
        '@babel/runtime/helpers/possibleConstructorReturn': '_possibleConstructorReturn',
        '@babel/runtime/helpers/getPrototypeOf': '_getPrototypeOf',
        '@babel/runtime/helpers/typeof': '_typeof',
        '@tarojs/runtime': 'runtime',
        '@tarojs/taro': 'taro'
      }
    }
  ],
  plugins: [
    resolve({
      preferBuiltins: false
    }),
    ts(),
    commonjs({
      include: 'node_modules/**'
    }),
    babel({
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', 'ts', 'tsx'],
      babelHelpers: 'runtime'
    })
  ]
}
const esmConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output[0], {
    sourcemap: true,
    format: 'es',
    file: path.join(cwd, 'dist/index.esm.js')
  })
})

function rollup () {
  const target = process.env.TARGET

  if (target === 'umd') {
    return baseConfig
  } else if (target === 'esm') {
    return esmConfig
  } else {
    return [baseConfig, esmConfig]
  }
}
module.exports = rollup()
