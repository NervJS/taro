import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript'

export default {
  input: 'src/index.tsx',
  external: ['nervjs', '@tarojs/taro-h5'],
  output: [{
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
