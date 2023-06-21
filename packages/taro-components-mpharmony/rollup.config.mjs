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
    }),

    // 复制 assets 目录下的 PNG 图片到 dist 目录
    copy({
      targets: [
        { src: 'src/assets/*.png', dest: 'dist/assets' },
        { src: 'src/assets/icons/*.png', dest: 'dist/assets/icons' },
        { src: 'src/assets/video/*.png', dest: 'dist/assets/video' }
      ]
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

const utilsConfig = {
  input: path.join(cwd, 'src/utils/index.ts'),
  output: {
    file: path.join(cwd, 'dist/utils/index.js'),
    format: 'cjs',
    sourcemap: true,
  },
  ...base
}

const assetsConfig = {
  input: path.join(cwd, 'src/assets/index.ts'),
  output: {
    file: path.join(cwd, 'dist/assets/index.js'),
    format: 'cjs',
    sourcemap: true,
  },
  ...base
}


export default [compileConfig, componentsConfig]
