const { join } = require('path')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('@rollup/plugin-babel').default
const common = require('rollup-plugin-commonjs')
const typescript = require('rollup-plugin-typescript2')
const cwd = __dirname

const baseConfig = {
  input: join(cwd, 'src/index.ts'),
  external: d => {
    return d.includes('@tarojs/runtime') || d.includes('@tarojs/taro') || d.includes('@babel/runtime')
  },
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
    resolve({
      preferBuiltins: false
    }),
    common({
      include: 'node_modules/**'
    }),
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
