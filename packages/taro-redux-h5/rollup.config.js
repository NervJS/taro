import * as fs from 'fs'
import alias from 'rollup-plugin-alias'
import memory from 'rollup-plugin-memory-2'
import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import es3 from 'rollup-plugin-es3'

export default {
  input: 'src/index.js',
  output: {
    sourcemap: true,
    name: '@tarojs/redux-h5',
    exports: 'default',
    format: 'umd',
    file: 'dist/index.js',
    globals: {
      'nervjs': 'Nerv',
      'redux': 'Redux',
      '@tarojs/taro-h5': 'taroH5'
    }
  },
  external: [
    'nervjs',
    'redux',
    '@tarojs/taro-h5'
  ],
  plugins: [
    memory({
      path: 'src/index.js',
      contents: "export { default } from './index';"
    }),
    {
      // This insane thing transforms Lodash CommonJS modules to ESModules. Doing so shaves 500b (20%) off the library size.
      load: function (id) {
        if (id.match(/\blodash\b/)) {
          return fs.readFileSync(id, 'utf8')
            .replace(/\b(?:var\s+)?([\w$]+)\s*=\s*require\((['"])(.*?)\2\)\s*[,;]/g, 'import $1 from $2$3$2;')
            .replace(/\bmodule\.exports\s*=\s*/, 'export default ')
        }
      }
    },
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
