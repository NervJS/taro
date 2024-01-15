import { mergeWith } from 'lodash'
import { defineConfig } from 'rollup'
import ts from 'rollup-plugin-ts'

import type { RollupOptions } from 'rollup'

const baseConfig: RollupOptions = {
  output: {
    sourcemap: true,
    exports: 'named'
  },
  plugins: [
    ts({
      tsconfig: e => ({
        ...e,
        preserveConstEnums: true,
      })
    })
  ]
}

const variesConfig: RollupOptions[] = [{
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    preserveModules: true,
    preserveModulesRoot: 'src'
  },
}, {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.cjs.js',
    format: 'cjs',
  },
}, {
  input: 'src/index.ts',
  output: {
    file: 'dist/shared.esm.js',
    format: 'es',
  },
},
// Note: template 只在编译时使用
{
  input: 'src/template.ts',
  output: {
    format: 'cjs',
    file: 'dist/template.js',
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
