const { join } = require('path')
const babel = require('@rollup/plugin-babel').default
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const typescript = require('rollup-plugin-typescript2')
const cwd = __dirname

const baseConfig = {
  input: join(cwd, 'src/index.ts'),
  external: ['@tarojs/runtime', '@tarojs/taro'],
  output: [
    {
      file: join(cwd, 'dist/index.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    typescript(),
    resolve({
      preferBuiltins: false,
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main']
    }),
    commonjs(),
    babel({
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', 'ts', 'tsx'],
      babelHelpers: 'runtime'
    })
  ]
}
const esmConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output, {
    sourcemap: true,
    format: 'es',
    file: join(cwd, 'dist/router.esm.js')
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
