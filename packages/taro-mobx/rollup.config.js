import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: [{
    name: '@tarojs/mobx',
    sourcemap: false,
    exports: 'named',
    format: 'cjs',
    file: 'dist/index.js'
  }],
  external: ['@tarojs/taro', '@tarojs/mobx-common'],
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
