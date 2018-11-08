import { pipe, set } from 'lodash/fp'
import { join } from 'path'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript'

const cwd = __dirname

const entries = [{
  input: 'hashRouter.tsx',
  output: 'hashRouter.js'
}, {
  input: 'browserRouter.tsx',
  output: 'browserRouter.js'
}]

const baseConfig = {
  external: ['nervjs', '@tarojs/taro-h5'],
  output: {
    format: 'cjs',
    sourcemap: false,
    exports: 'named'
  },
  plugins: [
    resolve({
      preferBuiltins: false
    }),
    typescript(),
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
        '@babel/plugin-syntax-dynamic-import',
        ['@babel/plugin-transform-react-jsx', {
          'pragma': 'Nerv.createElement'
        }]
      ]
    }),
    commonjs()
  ],
  watch: {
    include: 'src/**',
    clearScreen: true
  }
}

const appendConfigs = ({input, output}) => {
  return pipe(
    set('input', join(cwd, `src/${input}`)),
    set('output.file', join(cwd, `dist/${output}`))
  )(baseConfig)
}

export default entries.map(appendConfigs)
