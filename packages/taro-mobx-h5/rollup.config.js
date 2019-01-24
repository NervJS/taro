import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/index.js',
  external: ['nervjs', '@tarojs/taro-h5', 'mobx'],
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
        '@babel/plugin-syntax-dynamic-import',
        ['@babel/plugin-transform-react-jsx', {
          'pragma': 'Nerv.createElement'
        }]
      ]
    }),
    commonjs({
      include: ['../taro-mobx-common/index.js'],
      namedExports: {
        '../taro-mobx-common/index.js': [
          'observer', 'inject', 'setStore'
        ]
      }
    })
  ],
  watch: {
    include: 'src/**',
    clearScreen: true
  }
}
