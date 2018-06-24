import * as fs from 'fs'
const { join } = require('path')
const resolve = require('_rollup-plugin-node-resolve@3.3.0@rollup-plugin-node-resolve')
const babel = require('_rollup-plugin-babel@4.0.0-beta.5@rollup-plugin-babel')

const cwd = __dirname
const pkg = JSON.parse(fs.readFileSync('./package.json'))
const external = Object.keys(pkg.peerDependencies || {}).concat(Object.keys(pkg.dependencies || {}))

const baseConfig = {
  input: join(cwd, 'src/index.js'),
  output: [{
    file: join(cwd, 'dist/index.js'),
    format: 'cjs',
    sourcemap: true,
    exports: 'named'
  },
  {
    file: join(cwd, 'dist/taro-mobx.js'),
    format: 'umd',
    name: 'TaroMobx',
    sourcemap: true,
    exports: 'named'
  }
  ],
  external,
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
        '@babel/plugin-proposal-object-rest-spread', ['@babel/plugin-transform-react-jsx', {
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
