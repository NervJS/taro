import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import typescript from '@rollup/plugin-typescript'
import externals from 'rollup-plugin-node-externals'

const __filename = fileURLToPath(new URL(import.meta.url))
const cwd = path.dirname(__filename)

const baseConfig = {
  input: path.join(cwd, 'src/index.ts'),
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
    externals(),
    typescript(),
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
export default rollup()
