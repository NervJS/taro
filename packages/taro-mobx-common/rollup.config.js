import * as fs from 'fs'
import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import es3 from 'rollup-plugin-es3'

let pkg = JSON.parse(fs.readFileSync('./package.json'))

let external = Object.keys(pkg.peerDependencies || {}).concat(Object.keys(pkg.dependencies || {}))

let format = process.env.TARGET === 'es' ? 'es' : 'umd'

export default {
  input: 'src/index.js',
  output: {
    sourcemap: true,
    name: '@tarojs/mobx-common',
    exports: format === 'es' ? null : 'named',
    format,
    file: format === 'es' ? pkg.module : pkg.main,
  },
  external,
  plugins: [
    babel({
      presets: [
        ['@babel/preset-env', {
          modules: false
        }]
      ],
      plugins: [
        "babel-plugin-transform-react-remove-prop-types",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-object-rest-spread",
        ["@babel/plugin-transform-react-jsx", { pragma: "createElement" }]
      ]
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      preferBuiltins: false
    }),
    commonjs({
      include: ['node_modules/**']
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    es3()
  ].filter(Boolean)
}