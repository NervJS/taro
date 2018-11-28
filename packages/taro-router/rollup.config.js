const { join } = require('path')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const postcss = require('rollup-plugin-postcss')
const typescript = require('rollup-plugin-typescript')

const cwd = __dirname

const baseConfig = {
  input: join(cwd, 'src/index.tsx'),
  external: ['nervjs', '@tarojs/taro-h5'],
  output: [{
    file: join(cwd, 'dist/index.js'),
    format: 'cjs',
    sourcemap: false,
    exports: 'named'
  }],
  plugins: [
    typescript(),
    postcss({
      extensions: [ '.css' ]
    }),
    resolve({
      preferBuiltins: false
    }),
    babel({
      babelrc: false,
      extensions: ['.ts', '.tsx', '.es6', '.es', '.mjs'],
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
  ],
  watch: {
    include: 'src/**',
    clearScreen: true
  }
}
const esmConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output, {
    sourcemap: false,
    format: 'es',
    file: join(cwd, 'dist/index.esm.js')
  })
})

function rollup () {
  return [baseConfig, esmConfig]
}
module.exports = rollup()
