import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import externals from 'rollup-plugin-node-externals'
import postcss from 'rollup-plugin-postcss'
import ts from 'rollup-plugin-ts'

// 供 Loader 使用的运行时入口
export default {
  input: 'src/index.ts',
  plugins: [
    externals({
      deps: true,
      devDeps: false,
      include: [/^react$/]
    }),
    resolve({
      preferBuiltins: false,
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main']
    }),
    postcss({
      inject: { insertAt: 'top' }
    }),
    ts({
      sourceMap: true
    }),
    commonjs({
      include: '../../node_modules/**'
    }),
    babel({
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', 'ts', 'tsx'],
      babelHelpers: 'runtime'
    })
  ],
  output: {
    chunkFileNames: '[name].js',
    dir: 'dist',
    entryFileNames: '[name].js',
    format: 'es',
    preserveModules: true,
    preserveModulesRoot: 'src',
    sourcemap: true
  }
}
