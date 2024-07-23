import typescript from '@rollup/plugin-typescript'
import _ from 'lodash'
import { defineConfig } from 'rollup'
import externals from 'rollup-plugin-node-externals'

import type { RollupOptions } from 'rollup'

const baseConfig = {
  input: 'src/index.js',
  output: {
    sourcemap: true,
    exports: 'named'
  },
  plugins: [
    externals(),
    typescript({
      allowJs: true,
      allowSyntheticDefaultImports: true,
      include: ['src/**/*'],
      exclude: ['src/**/*/__tests__/**'],
    }),
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
  },
}, {
  output: {
    file: 'dist/index.esm.js',
    format: 'es',
  },
}]

export default defineConfig(variesConfig.map(v => {
  const customizer = function (objValue, srcValue) {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue)
    }
    if (typeof objValue === 'object') {
      return _.mergeWith({}, objValue, srcValue, customizer)
    }
  }
  return _.mergeWith({}, baseConfig, v, customizer)
}))
