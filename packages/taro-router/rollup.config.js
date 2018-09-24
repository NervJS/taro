const { join } = require('path')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const postcss = require('rollup-plugin-postcss')
const typescript = require('rollup-plugin-typescript')

const cwd = __dirname

const baseConfig = {
  input: join(cwd, 'src/index.tsx'),
  external: ['nervjs', '@tarojs/taro-h5'],
  output: [
    {
      file: join(cwd, 'dist/index.ts'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: join(cwd, 'dist/router.js'),
      format: 'umd',
      name: 'Router',
      sourcemap: true,
      exports: 'named'
    }
  ],
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
