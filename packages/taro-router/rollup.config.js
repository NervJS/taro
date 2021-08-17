import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import * as path from 'path'

const buble = require('rollup-plugin-buble')
const cwd = __dirname

const baseConfig = {
  input: path.join(cwd, 'src/index.ts'),
  external: ['@tarojs/runtime'],
  output: [
    {
      file: path.join(cwd, 'dist/index.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    buble({
      transforms: {
        asyncAwait: false,
        forOf: false
      }
    })
  ]
}
const esmConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output, {
    sourcemap: true,
    format: 'es',
    file: path.join(cwd, 'dist/router.esm.js')
  }),
  plugins: baseConfig.plugins.slice(0, baseConfig.plugins.length - 1)
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
