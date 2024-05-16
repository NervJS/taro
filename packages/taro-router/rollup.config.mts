import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import externals from 'rollup-plugin-node-externals'

import type { RollupOptions } from 'rollup'

const baseConfig: RollupOptions = {
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    exports: 'named'
  },
  plugins: [
    externals({
      deps: true,
      devDeps: false,
      include: [/^@tarojs\//]
    }),
    nodeResolve({
      preferBuiltins: false,
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main']
    }),
    typescript({
      include: ['src/**/*', 'types/**/*'] // 必须添加这行，否则会打包出 rollup.config.d.ts
    }),
    commonjs()
  ]
}

const variesConfig: RollupOptions[] = [{
  output: {
    dir: 'dist',
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
}, {
  output: {
    file: 'dist/index.cjs.js',
    format: 'cjs',
  }
},
{
  output: {
    file: 'dist/index.esm.js',
    format: 'es',
  }
}]

export default defineConfig(variesConfig.map(v => {
  return Object.assign({}, baseConfig, v)
}))
