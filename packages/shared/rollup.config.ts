import typescript from '@rollup/plugin-typescript'
import _ from 'lodash'
import { defineConfig } from 'rollup'

import type { RollupOptions } from 'rollup'

const baseConfig: RollupOptions = {
  output: {
    sourcemap: true,
    exports: 'named'
  },
  plugins: [
    typescript({
      compilerOptions: {
        preserveConstEnums: true,
      },
      include: ['src/**/*']
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
      return _.mergeWith({}, objValue, srcValue, customizer)
    }
  }
  return _.mergeWith({}, baseConfig, v, customizer)
}))
