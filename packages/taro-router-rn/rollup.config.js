import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript'
// import image from 'rollup-plugin-image'
import copy from 'rollup-plugin-copy-assets'

var flow = require('rollup-plugin-flow')

export default {
  input: 'src/index.js',
  external: ['react', 'react-native'],
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: false,
      exports: 'named'
    }, {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: false,
      exports: 'named'
    }],
  plugins: [
    flow(),
    resolve({
      preferBuiltins: false
    }),
    typescript(),
    babel({
      babelrc: false,
      extensions: ['.ts', '.tsx', '.es6', '.es', '.mjs', '.js'],
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false
          }]
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-react-jsx'
      ]
    }),
    commonjs({
      include: [
        '/node_modules/**',
        /node_modules/
      ]
    }),
    copy({
      assets: [
        'src/assets'
      ]
    })
  ],
  watch: {
    include: 'src/**',
    clearScreen: true
  }
}
