import path from 'node:path'

import alias, { type RollupAliasOptions } from '@rollup/plugin-alias'
import { chalk, defaultMainFields, NODE_MODULES, resolveSync } from '@tarojs/helper'
import { type InputPluginOption, rollup } from 'rollup'
import dts from 'rollup-plugin-dts'

import { NPM_DIR } from '../../utils'
import { getPkgName } from './package'

import type Harmony from '..'

interface IPluginOptions {
  input: string
  output: string
  aliasOptions?: RollupAliasOptions['entries']
}

export function resolveDtsPlugin (filePath = '', externalDeps: Harmony['externalDeps'] = []): InputPluginOption {
  return {
    name: 'rollup-package-resolve-plugin',
    resolveId (source) {
      if (externalDeps.some(([id, rgx]) => rgx.test(source) || id === source)) {
        const typeId = path.relative(filePath, source)
        return {
          id: `${typeId.startsWith('.') ? '' : './'}${typeId}`,
          external: 'relative',
          resolvedBy: 'rollup-package-resolve-plugin'
        }
      }
    },
  }
}

export function typescriptNameSpacePlugin (): InputPluginOption {
  return {
    name: 'rollup-typescript-namespace-export-fixed-plugin',
    transform (code: string, id: string) {
      // Note: dts 插件未能正确识别 export = 语法，不能通过 commonjs 插件转换，这里手动修复
      if (/@types[\\/]react-reconciler[\\/]index.d.ts$/.test(id)) {
        return [
          code,
          `export type OpaqueRoot = ReactReconciler.OpaqueRoot`,
        ].join('\n')
      } else if (/@types[\\/]react[\\/]index.d.ts$/.test(id)) {
        return [
          code,
          `export type Component = React.Component`,
          `export type ComponentClass = React.ComponentClass`,
          `export type CSSProperties = React.CSSProperties`,
          `export type ReactNode = React.ReactNode`,
          `export type ReactElement = React.ReactElement`,
        ].join('\n')
      }
    },
  }
}

export default async function generateDefinition (this: Harmony, {
  input,
  output,
  aliasOptions = {},
}: IPluginOptions) {
  const that = this
  const pkgPath = getPkgName(output, NPM_DIR) + '/'

  return rollup({
    input,
    external: [
      /^@(system\.|ohos\.|hmscore\/|jd-oh\/)/,
      /^lib.+\.so/,
      // 'react',
      // 'react-reconciler',
    ],
    shimMissingExports: true,
    plugins: [
      resolveDtsPlugin(pkgPath, that.externalDeps),
      alias({
        entries: aliasOptions,
      }),
      typescriptNameSpacePlugin(),
      dts({
        respectExternal: true,
      }),
    ],
  }).then(async bundle => {
    return bundle.write({
      file: output,
      format: 'esm',
      exports: 'named'
    })
  })
}

export function getPkgFile (lib: string, npmPathName = NODE_MODULES) {
  const pkg = lib.includes(npmPathName) ? lib.replace(new RegExp(`^.+[\\\\/]${npmPathName}[\\\\/]`), '') : lib
  const etx = path.extname(pkg)
  if (pkg.endsWith(`index${etx}`)) {
    return path.dirname(pkg)
  } else if (etx) {
    return path.join(path.dirname(pkg), path.basename(pkg, etx))
  } else {
    return pkg
  }
}

export function findDTSFile (lib: string, basedir = process.cwd(), npmPathName = NODE_MODULES) {
  if (!lib) return null
  if (lib.endsWith('index.js')) {
    lib = path.dirname(lib)
  }
  lib = lib.replace(/\.m?js$/, '')

  const config = {
    basedir,
    extensions: ['.d.ts'],
    mainFields: ['types', ...defaultMainFields],
    preserveSymlinks: false,
  }

  let filePath = resolveSync(lib, config)

  console.log(`查找 ${chalk.yellow(lib)} 类型文件...`, filePath) // eslint-disable-line no-console
  if (!filePath || !filePath.endsWith('.d.ts')) {
    let pkgName = getPkgFile(lib, npmPathName)
    console.log(`未找到 ${chalk.yellow(lib)} 类型文件，尝试从 @types/${lib} 查找...\n`) // eslint-disable-line no-console
    if (pkgName.startsWith('@')) {
      pkgName = pkgName.replace('@', '').replace(/\//g, '__')
    }
    filePath = resolveSync(`@types/${pkgName}`, config)
  }

  return filePath && filePath.endsWith('.d.ts') ? filePath : null
}
