import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { mergeWith } from 'lodash'
import externals from 'rollup-plugin-node-externals'
import postcss from 'rollup-plugin-postcss'
import ts from 'rollup-plugin-ts'

import exportNameOnly from './build/rollup-plugin-export-name-only'

const baseConfig = {
  output: {
    format: 'cjs',
    sourcemap: true,
    exports: 'named'
  },
  treeshake: false,
  plugins: [
    externals({
      devDeps: false
    }),
    resolve({
      preferBuiltins: false,
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main']
    }),
    ts({
      declaration: false,
      sourceMap: true,
    }),
    commonjs(),
    postcss({
      inject: { insertAt: 'top' }
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
}, {
  input: 'src/index.ts',
  output: {
    format: 'es',
    file: 'dist/index.esm.js'
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
