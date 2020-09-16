const { join } = require('path')
const resolve = require('rollup-plugin-node-resolve')
const cjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const cwd = __dirname

const baseConfig = {
  external: ['nervjs', '@tarojs/runtime', '@tarojs/taro-h5'],
  plugins: [
    resolve({
      preferBuiltins: false
    }),
    cjs(),
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
          pragma: 'Nerv.createElement'
        }]
      ]
    })
  ]
}

const miniUmdConfig = Object.assign({}, baseConfig, {
  input: join(cwd, 'src/index.js'),
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
  ]
})

const miniEsmConfig = Object.assign({}, baseConfig, {
  input: join(cwd, 'src/index.js'),
  output: {
    sourcemap: true,
    format: 'es',
    file: join(cwd, 'dist/index.esm.js')
  }
})

const h5CjsConfig = Object.assign({}, baseConfig, {
  input: join(cwd, 'src/h5-cjs.js'),
  output: {
    file: join(cwd, 'dist/h5.js'),
    format: 'cjs',
    sourcemap: true,
    exports: 'named'
  }
})

const h5EsmConfig = Object.assign({}, baseConfig, {
  input: join(cwd, 'src/h5.js'),
  output: {
    sourcemap: true,
    format: 'es',
    file: join(cwd, 'dist/h5.esm.js')
  }
})

function rollup () {
  const target = process.env.TARGET

  if (target === 'umd') {
    return [miniUmdConfig, h5CjsConfig]
  } else if (target === 'esm') {
    return [miniEsmConfig, h5EsmConfig]
  } else {
    return [miniUmdConfig, miniEsmConfig, h5EsmConfig, h5CjsConfig]
  }
}
module.exports = rollup()
