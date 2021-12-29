import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

const baseConfig = {
  input: 'src/index.js',
  external: d => {
    return /^@tarojs\/runtime$/.test(d) || d.includes('@babel/runtime')
  },
  plugins: [
    resolve({
      preferBuiltins: false
    }),
    commonjs(),
    babel({
      babelHelpers: 'runtime'
    })
  ]
}

const common = Object.assign({}, baseConfig, {
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    sourcemap: true,
    exports: 'named'
  }
})

const umd = Object.assign({}, baseConfig, {
  output: {
    file: 'dist/taro.js',
    format: 'umd',
    name: 'Taro',
    sourcemap: true,
    exports: 'named',
    globals: {
      '@babel/runtime/helpers/typeof': '_typeof',
      '@babel/runtime/helpers/objectSpread2': '_objectSpread',
      '@babel/runtime/helpers/classCallCheck': '_classCallCheck',
      '@babel/runtime/helpers/createClass': '_createClass',
      '@babel/runtime/helpers/defineProperty': '_defineProperty',
      '@tarojs/runtime': 'runtime'
    }
  }
})

const esm = Object.assign({}, baseConfig, {
  output: {
    sourcemap: true,
    format: 'es',
    file: 'dist/index.esm.js'
  }
})

module.exports = [common, umd, esm]
