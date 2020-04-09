const { join } = require('path')
const resolve = require('rollup-plugin-node-resolve')
const cjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const cwd = __dirname

const baseConfig = {
  input: join(cwd, 'src/index.js'),
  external: ['nervjs', '@tarojs/runtime'],
  output: [
    {
      file: join(cwd, 'dist/index.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: join(cwd, 'dist/taro.js'),
      format: 'umd',
      name: 'Taro',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    resolve({
      preferBuiltins: false
    }),
    cjs()
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
