const { join } = require('path')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const builtins = require('rollup-plugin-node-builtins')
const babel = require('rollup-plugin-babel')
const cwd = __dirname

// function resolver (path) {
//   return join(__dirname, path)
// }

// const optJSPlugin = {
//   name: 'optimizeJs',
//   transformBundle (code) {
//     return optimizeJs(code, {
//       sourceMap: false,
//       sourceType: 'module'
//     })
//   }
// }

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
    builtins(),
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
    }),
    commonjs()
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
