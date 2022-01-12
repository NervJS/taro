import { mergeWith } from 'lodash'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'

import exportNameOnly from './build/rollup-plugin-export-name-only'

const baseConfig = {
  external: d => {
    return /^@tarojs\/(api|router|runtime|taro)$/.test(d) || d.includes('@babel/runtime')
  },
  output: {
    format: 'cjs',
    sourcemap: false,
    exports: 'auto'
  },
  treeshake: false,
  plugins: [
    resolve({
      preferBuiltins: false,
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main']
    }),
    postcss({
      inject: { insertAt: 'top' }
    }),
    babel({
      babelHelpers: 'bundled'
    }),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true
    })
  ]
}

const variesConfig = [{
  input: 'src/api/index.ts',
  output: {
    file: 'dist/taroApis.js'
  },
  plugins: exportNameOnly()
}, {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.cjs.js'
  }
}]

export default variesConfig.map(v => {
  const customizer = function (objValue, srcValue) {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue)
    }
    if (typeof objValue === 'object') {
      return mergeWith({}, objValue, srcValue, customizer)
    }
  }
  return mergeWith({}, baseConfig, v, customizer)
})
