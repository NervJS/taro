import * as path from 'path'
import typescript from 'rollup-plugin-typescript2'

const buble = require('rollup-plugin-buble')

const cwd = __dirname

const baseConfig = {
  input: path.join(cwd, 'src/index.ts'),
  output: [
    {
      file: path.join(cwd, 'dist/index.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    }
  ],
  external: ['@tarojs/runtime', 'scheduler', 'react-reconciler', '@tarojs/shared'],
  plugins: [
    typescript(),
    buble()
  ]
}

const esmConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output, {
    sourcemap: true,
    format: 'es',
    file: path.join(cwd, 'dist/react.esm.js')
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
