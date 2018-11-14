import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    sourcemap: false,
    name: '@tarojs/mobx',
    exports: 'named',
    format: 'umd',
    file: 'dist/index.js'
  },
  plugins: [
    babel({
      presets: [
        ['@babel/preset-env', {
          modules: false
        }]
      ],
      plugins: [
        "@babel/plugin-proposal-class-properties"
      ]
    })
  ].filter(Boolean)
}