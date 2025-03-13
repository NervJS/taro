import path from 'node:path'

import alias, { type RollupAliasOptions } from '@rollup/plugin-alias'
import common from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser, { type Options as TerserOptions } from '@rollup/plugin-terser'
import { NODE_MODULES } from '@tarojs/helper'
import { DEFAULT_TERSER_OPTIONS } from '@tarojs/vite-runner/dist/utils/constants'
import { defineConfig, rollup } from 'rollup'
import externals, { type ExternalsOptions } from 'rollup-plugin-node-externals'
import ts from 'rollup-plugin-ts'

import { isDebug, NPM_DIR, SEP_RGX } from '../../utils'
import globalPlugin from './global-plugin'

import type Harmony from '..'

interface IPluginOptions {
  input: string
  output: string
  aliasOptions?: RollupAliasOptions['entries']
  externalsOptions?: ExternalsOptions
  replaceOptions?: Record<string, string>
  declaration?: boolean
}

/**
 * TODO
 * - [ ] 优化输出 js 内容，使用已有的 global 插件
 * - [ ] 检查 runtime.esm 合并后，runtime 导出是否缺失
 * - [ ] 检查所有包 external 依赖，配置到生成包的对应路径（包括类型文件，同时需要注入缺失的类型文件）
 * - [ ] 检查所有包 define、env 配置，确保 rollup 正确编译相关内容，并抖动不必要的代码模块
 * - [ ] 生成 init 依赖方法，在页面模板中引用
 */
export default async function generatePackage(
  this: Harmony,
  { input, output, aliasOptions = {}, externalsOptions = {}, replaceOptions = {}, declaration = false }: IPluginOptions
) {
  return rollup(
    defineConfig({
      input,
      external: [/^@(system\.|ohos\.|hmscore\/|jd-oh\/)/, /^lib.+\.so/],
      treeshake: !isDebug,
      shimMissingExports: true,
      plugins: [
        globalPlugin({
          moduleId: getPkgName(output, NPM_DIR),
        }),
        externals({
          devDeps: false,
          ...externalsOptions,
        }),
        alias({
          entries: aliasOptions,
        }),
        replace({
          preventAssignment: true,
          values: replaceOptions,
        }),
        ts({
          transpileOnly: true,
          tsconfig: (e) => ({
            ...e,
            declaration,
            sourceMap: false,
          }),
        }),
        nodeResolve({
          preferBuiltins: false,
        }),
        common({
          sourceMap: false,
        }),
        json(),
        isDebug ? null : terser(DEFAULT_TERSER_OPTIONS as TerserOptions),
      ],
    })
  ).then(async (bundle) => {
    return bundle.write({
      file: output,
      format: 'esm',
      exports: 'named',
    })
  })
}

export function getPkgName(lib: string, npmPathName = NODE_MODULES) {
  const pkg = lib.includes(npmPathName) ? lib.replace(new RegExp(`^.+[\\\\/]${npmPathName}[\\\\/]`), '') : lib
  if (path.extname(pkg)) {
    return path.dirname(pkg).replace(SEP_RGX, '/')
  } else {
    return pkg
  }
}
