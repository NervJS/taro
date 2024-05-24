import { mergeWith } from 'lodash'
import { defineConfig } from 'rollup'
import externals from 'rollup-plugin-node-externals'
import ts from 'rollup-plugin-ts'

import type { RollupOptions } from 'rollup'

const baseConfig = {
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    exports: 'named'
  },
  plugins: [
    externals({
      deps: true,
      devDeps: false,
      include: [/^(react|react-dom|nervjs|vue)$/, /^inversify$/]
    }),
    ts(),
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
    file: 'dist/runtime.esm.js',
    format: 'es',
  },
}]

export default defineConfig(variesConfig.map(v => {
  const customizer = function (objValue, srcValue) {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue)
    }
    if (typeof objValue === 'object') {
      return mergeWith({}, objValue, srcValue, customizer)
    }
  }
  return mergeWith({}, baseConfig, v, customizer)
}))
