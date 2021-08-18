import { mergeWith } from 'lodash'
import { join } from 'path'
import resolve from '@rollup/plugin-node-resolve'
import common from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import alias from '@rollup/plugin-alias'
import postcss from 'rollup-plugin-postcss'
import exportNameOnly from './build/rollup-plugin-export-name-only'

const cwd = __dirname
const baseConfig = {
  external: ['nervjs', '@tarojs/runtime', 'react-dom'],
  output: {
    format: 'cjs',
    sourcemap: false,
    exports: 'auto'
  },
  plugins: [
    alias({
      entries: {
        '@tarojs/taro': join(cwd, '../taro/src/index')
      }
    }),
    resolve({
      preferBuiltins: false,
      mainFields: ['module', 'js-next', 'main']
    }),
    postcss(),
    common(),
    babel()
  ]
}

const variesConfig = [{
  input: 'src/api/index.js',
  output: {
    file: 'dist/taroApis.js'
  },
  plugins: exportNameOnly()
}, {
  input: 'src/index.cjs.js',
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
