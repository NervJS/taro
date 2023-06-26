import nodeResolve  from '@rollup/plugin-node-resolve'  //解析Node.js模块
import path from "path";
import commonjs from "@rollup/plugin-commonjs"; //解析CommonJs模块
import clear from "rollup-plugin-clear"
import ts from 'rollup-plugin-ts'
import babel from '@rollup/plugin-babel'
import scss from 'rollup-plugin-scss';
import copy from 'rollup-plugin-copy';

const cwd = path.dirname(new URL(import.meta.url).pathname);
import { mkdirSync } from 'fs';

const base = {
  external: ['@types/node'],
  plugins: [
    ts(),
    nodeResolve(),
    commonjs(),
    scss(),
    clear({
      targets: ['dist']
    }),
    babel({
      babelHelpers: 'bundled',
      presets: [['@babel/preset-env', { targets: { ie: '11' } }]]
    })
  ]
}

const compileConfig = {
  input: path.join(cwd, 'src/index.ts'),
  output: {
    file: path.join(cwd, 'dist/index.js'),
    format: 'cjs',
    sourcemap: true,
    export: 'named',
    inlineDynamicImports: true
  },
  ...base
}

const componentsConfig = {
  input: path.join(cwd, 'src/components/index.ts'),
  output: {
    file: path.join(cwd, 'dist/components/index.js'),
    //dir: path.join(cwd, 'dist/components'),
    format: 'cjs',
    sourcemap: true,
   // inlineDynamicImports: true
  },
  ...base
}

const commonConfig = {
  input: path.join(cwd, 'src/common/index.ts'),
  output: {
    file: path.join(cwd, 'dist/common/index.js'),
    format: 'cjs',
    sourcemap: true,
  },
  ...base
}


export default [compileConfig, componentsConfig,commonConfig]
