import typescript from '@rollup/plugin-typescript'
import _ from 'lodash'
import { defineConfig } from 'rollup'
import externals from 'rollup-plugin-node-externals'

import type { RollupOptions } from 'rollup'

const baseConfig: RollupOptions = {
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    exports: 'named',
  },
  plugins: [
    externals({
      peerDeps: true,
    }),
    typescript({
      include: ['src/**/*'] // 必须添加这行，否则会打包出 rollup.config.d.ts
    })
  ]
}

const variesConfig: RollupOptions[] = [{
  output: {
    dir: 'dist',
    preserveModules: true,
    preserveModulesRoot: 'src'
  }
}, {
  output: {
    file: 'dist/index.cjs.js',
    format: 'cjs',
    inlineDynamicImports: true,
  }
}, {
  output: {
    file: 'dist/taro.js',
    format: 'umd',
    inlineDynamicImports: true,
    name: 'Taro',
    globals: {
      '@babel/runtime/helpers/typeof': '_typeof',
      '@babel/runtime/helpers/objectSpread2': '_objectSpread',
      '@babel/runtime/helpers/classCallCheck': '_classCallCheck',
      '@babel/runtime/helpers/createClass': '_createClass',
      '@babel/runtime/helpers/defineProperty': '_defineProperty',
      '@tarojs/runtime': 'runtime',
      '@tarojs/shared': 'shared',
    }
  }
},
{
  output: {
    format: 'es',
    file: 'dist/index.esm.js',
    inlineDynamicImports: true,
  }
}]

export default defineConfig(variesConfig.map(v => {
  return _.mergeWith({}, baseConfig, v)
}))
