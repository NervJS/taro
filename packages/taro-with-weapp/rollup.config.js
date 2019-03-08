const { join } = require('path')
const resolve = require('rollup-plugin-node-resolve')
const buble = require('rollup-plugin-buble')
const common = require('rollup-plugin-commonjs')
const alias = require('rollup-plugin-alias')
const typescript = require('rollup-plugin-typescript2')
const cwd = __dirname

const baseConfig = {
  input: join(cwd, 'src/index.ts'),
  output: [
    {
      file: join(cwd, 'dist/index.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: join(cwd, 'dist/with-weapp.js'),
      format: 'umd',
      name: 'TaroWithWeapp',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    typescript(),
    alias({
      '@tarojs/taro': join(cwd, '../taro/src/index')
    }),
    resolve({
      preferBuiltins: false
    }),

    common({
      include: 'node_modules/**'
    }),
    buble({
      objectAssign: 'Object.assign'
    })
  ]
}
const esmConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output, {
    sourcemap: true,
    format: 'es',
    file: join(cwd, 'dist/index.esm.js')
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
