import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import ts from '@rollup/plugin-typescript'
import { mergeWith } from 'lodash'
import { defineConfig } from 'rollup'
import { dts } from 'rollup-plugin-dts'
import externals from 'rollup-plugin-node-externals'
import postcss from 'rollup-plugin-postcss'

import type { InputPluginOption, RollupOptions } from 'rollup'

const baseConfig: RollupOptions = {
  output: {
    sourcemap: true,
    exports: 'named',
  },
  treeshake: false,
  plugins: [
    externals({
      deps: true,
      devDeps: false,
    }),
    nodeResolve({
      preferBuiltins: false,
      mainFields: ['browser', 'module', 'jsnext:main', 'main'],
    }) as InputPluginOption,
    ts({
      exclude: ['rollup.config.ts']
    }),
    commonjs() as InputPluginOption,
    postcss({
      // extract: true, Note: 开启需要在 @tarojs/plugin-platform-h5 中的 API 引入样式
      inject: { insertAt: 'top' },
      minimize: true,
    }) as InputPluginOption,
  ],
}

const variesConfig: RollupOptions[] = [
  {
    input: ['src/index.ts', 'src/api/index.ts', 'src/api/taro.ts'],
    output: {
      dir: 'dist',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  },
]

variesConfig.push({
  input: 'src/index.ts',
  output: {
    file: 'dist/index.esm.js',
    inlineDynamicImports: true
  }
},
{
  // 需要该配置才能生成打包的 .d.ts 文件供 taro-platform-h5\build\definition-json\parser.ts 生成 apis 配置
  input: 'src/index.ts',
  output: { file: 'dist/index.esm.d.ts' },
  plugins: [dts()]
})

if (process.env.NODE_ENV === 'production') {
  variesConfig.push(
    {
      input: 'src/index.ts',
      output: {
        format: 'cjs',
        file: 'dist/index.cjs.js',
        inlineDynamicImports: true,
      },
    }
  )
}

export default defineConfig(
  variesConfig.map((v) => {
    const customizer = function (objValue, srcValue) {
      if (Array.isArray(objValue)) {
        return objValue.concat(srcValue)
      }
      if (typeof objValue === 'object') {
        return mergeWith({}, objValue, srcValue, customizer)
      }
    }
    return mergeWith({}, baseConfig, v, customizer)
  })
)
