import nodeResolve  from '@rollup/plugin-node-resolve'  //解析Node.js模块
import path from "path";
import commonjs from "@rollup/plugin-commonjs"; //解析CommonJs模块
import clear from "rollup-plugin-clear"
import ts from 'rollup-plugin-ts'
import babel from '@rollup/plugin-babel'
// import scss from 'rollup-plugin-scss';
import copy from 'rollup-plugin-copy';
import RollupCopy from 'rollup-plugin-copy'
import nodeExternals from 'rollup-plugin-node-externals'
import postcss from 'rollup-plugin-postcss'

const cwd = process.cwd();
import { mkdirSync } from 'fs';
import NodePath from "path";

export default {
  input: 'src/index.ts',
  output: [
    {
      file: path.resolve(cwd, 'dist/index.esm.js'),
      format: 'es',
      sourcemap: true
    },
    {
      file: path.resolve(cwd, 'dist/index.js'),
      format: 'cjs',
      sourcemap: true
    }
  ],
  external: [
    'react',
    'react-dom',
    '@tarojs/components',
    '@tarojs/runtime',
    '@tarojs/taro',
    '@tarojs/react',
    '@types/node'
  ],
  plugins: [
    nodeExternals({
      deps: true,
      devDeps: false,
      include: [/^react$/]
    }),
    nodeResolve({
      preferBuiltins: false,
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main']
    }),
    commonjs({
      include: /\/node_modules\//
    }),
    postcss({
      inject: { insertAt: 'top' }
    }),
    ts({
      sourceMap: true
    }),
    clear({
      targets: ['dist']
    }),
    babel({
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', 'ts', 'tsx'],
      babelHelpers: 'runtime',
      exclude: '**/node_modules/**'
    })
  ]
}

// const base = {
//   external: ['@types/node'],
//   plugins: [
//     ts(),
//     nodeResolve(),
//     commonjs(),
//     scss(),
//     clear({
//       targets: ['dist']
//     }),
//     babel({
//       babelHelpers: 'bundled',
//       presets: [['@babel/preset-env', { targets: { ie: '11' } }]]
//     }),
//     RollupCopy({
//       targets: [
//         {
//           src: 'src/style',
//           dest: 'dist'
//         }
//       ]
//     })
//   ]
// }
//
// const compileConfig = {
//   input: path.join(cwd, 'src/index.ts'),
//   output: {
//     file: path.join(cwd, 'dist/index.js'),
//     format: 'cjs',
//     sourcemap: true,
//     export: 'named',
//     inlineDynamicImports: true
//   },
//   ...base
// }
//
// const componentsConfig = {
//   input: path.join(cwd, 'src/components/index.ts'),
//   output: {
//     file: path.join(cwd, 'dist/components/index.js'),
//     //dir: path.join(cwd, 'dist/components'),
//     format: 'cjs',
//     sourcemap: true,
//    // inlineDynamicImports: true
//   },
//   ...base
// }
//
// const commonConfig = {
//   input: path.join(cwd, 'src/common/index.ts'),
//   output: {
//     file: path.join(cwd, 'dist/common/index.js'),
//     format: 'cjs',
//     sourcemap: true,
//   },
//   ...base
// }
//
// export default [compileConfig, componentsConfig,commonConfig]
