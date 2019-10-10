const { join } = require('path')
const buble = require('rollup-plugin-buble')
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
      file: join(cwd, 'dist/taro-runtime.js'),
      format: 'umd',
      name: 'TaroRuntime',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    alias({
      entries: [
        {
          find: '@tarojs/shared',
          replacement: join(cwd, '../shared/dist/index.esm')
        }
      ]
    }),
    typescript(),
    buble()
  ]
}
const esmConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output, {
    sourcemap: true,
    format: 'es',
    file: join(cwd, 'dist/index.esm.js')
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
