import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: [{
    name: '@tarojs/mobx-common',
    sourcemap: false,
    exports: 'named',
    format: 'cjs',
    file: 'dist/index.js'
  }, {
    sourcemap: false,
    exports: 'named',
    format: 'esm',
    file: 'dist/index.esm.js'
  }],
  external: ['mobx'],
  plugins: [
    babel({
      presets: [
        ['@babel/preset-env', {
          modules: false
        }]
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties'
      ]
    })
  ]
}
