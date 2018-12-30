const { join } = require('path')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const cwd = __dirname

const baseConfig = {
  input: join(cwd, 'src/index.js'),
  output: {
    sourcemap: true,
    name: 'TaroUtils',
    format: 'es',
    file: join(cwd, 'dist/index.js')
  },
  plugins: [
    resolve({
      preferBuiltins: false
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
        '@babel/plugin-proposal-object-rest-spread'
      ]
    })
  ]
}

module.exports = baseConfig
