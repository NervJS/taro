const { join } = require('path')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const common = require('rollup-plugin-commonjs')
const alias = require('rollup-plugin-alias')
const cwd = __dirname

const baseConfig = {
  input: join(cwd, 'src/index.js'),
  external: ['nervjs'],
  output: [
    {
      file: join(cwd, 'dist/index.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: join(cwd, 'dist/taro-weapp.js'),
      format: 'umd',
      name: 'TaroWeapp',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    alias({
      '@tarojs/taro': join(cwd, '../taro/src/index'),
      '@tarojs/utils': join(cwd, '../taro-utils/dist/index')
    }),
    resolve({
      preferBuiltins: false
    }),

    common({
      include: 'node_modules/**'
    }),
    babel({
      babelrc: false,
      presets: [
        ['@babel/preset-env', {
          modules: false
        }]
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        ['@babel/plugin-transform-react-jsx', {
          'pragma': 'Nerv.createElement'
        }]
      ]
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
