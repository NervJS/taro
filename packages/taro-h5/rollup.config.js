import { mergeWith } from 'lodash'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import externals from 'rollup-plugin-node-externals'
import postcss from 'rollup-plugin-postcss'

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
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      sourceMap: true
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
