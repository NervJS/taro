import alias from 'rollup-plugin-alias'
import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import es3 from 'rollup-plugin-es3'

export default {
  input: 'src/index.js',
  output: [{
    sourcemap: false,
    name: '@tarojs/redux-h5',
    exports: 'named',
    format: 'cjs',
    file: 'dist/index.js'
  }, {
    sourcemap: false,
    name: '@tarojs/redux-h5',
    exports: 'named',
    format: 'esm',
    file: 'dist/index.esm.js'
  }],
  external: [
    'nervjs',
    'redux',
    '@tarojs/taro-h5'
  ],
  plugins: [
    alias({
      'react': __dirname + '/src/compat.js',
      'invariant': __dirname + '/src/invariant.js',
      'prop-types': __dirname + '/src/prop-types.js'
    }),
    babel({
      presets: [
        ['@babel/preset-env', {
          loose: true,
          modules: false
        }]
      ],
      plugins: [
        "babel-plugin-transform-react-remove-prop-types",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-object-rest-spread",
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["@babel/plugin-transform-react-jsx", { pragma: "createElement" }]
      ]
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      preferBuiltins: false
    }),
    commonjs({
      include: ['node_modules/**'],
      exclude: ['node_modules/react-redux/**']
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    es3()
  ].filter(Boolean)
}
