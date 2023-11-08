import buble from '@rollup/plugin-buble'
import replace from '@rollup/plugin-replace'
import * as path from 'path'
import ts from 'rollup-plugin-ts'

import type { InputPluginOption, RollupOptions } from 'rollup'

const cwd = __dirname

const baseConfig: RollupOptions & { plugins: InputPluginOption[] } = {
  input: path.join(cwd, 'src/index.ts'),
  external: ['react', 'nervjs', 'react-dom', 'vue', '@tarojs/shared', 'inversify'],
  output: [
    {
      file: path.join(cwd, 'dist/runtime.cjs.js'),
      format: 'cjs',
      sourcemap: false,
      exports: 'named',
    },
  ],
  plugins: [ts(), buble()],
}
const esmConfig: RollupOptions = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output?.[0], {
    sourcemap: true,
    format: 'es',
    file: path.join(cwd, 'dist/runtime.esm.js'),
  }),
  plugins: baseConfig.plugins.slice(0, baseConfig.plugins.length - 1),
})

const webConfig: RollupOptions = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output?.[0], {
    file: path.join(cwd, 'dist/runtime.h5.js'),
  }),
  plugins: baseConfig.plugins.slice(0, baseConfig.plugins.length - 1).concat([
    replace({
      objectGuards: true,
      preventAssignment: true,
      values: {
        ENABLE_INNER_HTML: 'false',
        ENABLE_ADJACENT_HTML: 'false',
        ENABLE_SIZE_APIS: 'false',
        ENABLE_TEMPLATE_CONTENT: 'false',
        ENABLE_MUTATION_OBSERVER: 'false',
        ENABLE_CLONE_NODE: 'false',
        ENABLE_CONTAINS: 'false',
        'process.env.TARO_PLATFORM': JSON.stringify('web'),
      },
    }),
    replace({
      delimiters: ['', ''],
      objectGuards: true,
      preventAssignment: true,
      values: {
        'isWebPlatform()': 'true',
      },
    }),
  ]),
})

function rollup(): RollupOptions | RollupOptions[] {
  const target = process.env.TARGET

  if (target === 'umd') {
    return baseConfig
  } else if (target === 'esm') {
    return esmConfig
  } else {
    return [baseConfig, esmConfig, webConfig]
  }
}

export default rollup()
