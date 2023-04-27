import { defaultEsbuildLoader, esbuild, externalEsbuildModule, fs } from '@tarojs/helper'
import path from 'path'

import {
  getDefines,
  getResolve,
  isExclude,
  isOptimizeIncluded,
  isScanIncluded
} from '../utils'
import {
  assetsRE,
  commentRE,
  importsRE,
  langRE,
  moduleRE,
  multilineCommentsRE,
  scriptRE,
  singlelineCommentsRE,
  virtualModulePrefix,
  virtualModuleRE
} from '../utils/constant'

import type Chain from 'webpack-chain'
import type { CollectedDeps } from '../utils/constant'

interface ScanImportsConfig {
  appPath: string
  chain: Chain
  entries: string[]
  include: string[]
  exclude: string[]
  customEsbuildConfig?: Record<string, any>
}

export async function scanImports ({
  appPath,
  chain,
  entries,
  include = [],
  exclude = [],
  customEsbuildConfig = {}
}: ScanImportsConfig,
deps: CollectedDeps = new Map()
): Promise<CollectedDeps> {
  const scanImportsPlugin = getScanImportsPlugin(deps, include, exclude)
  const customPlugins = customEsbuildConfig.plugins || []

  await Promise.all(entries.map(async entry => {
    try {
      await esbuild.build({
        ...customEsbuildConfig,
        absWorkingDir: appPath,
        bundle: true,
        entryPoints: [entry],
        mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main'],
        format: 'esm',
        loader: defaultEsbuildLoader,
        write: false,
        define: {
          ...getDefines(chain),
          define: 'false'
        },
        plugins: [
          scanImportsPlugin,
          ...customPlugins
        ]
      })
    } catch (e) {} // eslint-disable-line no-empty
  }))

  // 有一些 Webpack loaders 添加的依赖没有办法提前分析出来
  // 可以把它们写进 includes，然后在这里 resolve 后加入到 deps
  const resolve = getResolve()
  await Promise.all(include.map(async item => {
    if (isExclude(item, exclude)) return
    const resolvePath = await resolve(appPath, item)
    deps.set(item, resolvePath)
  }))

  return deps
}

/**
 * 收集 node_modules 依赖
 * Circumstances:
 *   1. import 'xxx.scss', import '../xxx.png' => external
 *   2. import 'xxx.vue', import '../xxx.vue'
 *       => collect script: { key: { loader, contents } }
 *       => virtual-mode compose of "export * from 'key';""
 *       => load virtual-mode and return { loader, contents }
 *   3. import 'xxx', import 'xxx/yyy.ext', import '@xxx/alias'
 *       => resolve
 *       => path.includes(node_modules) && .js|.jsx|.ts|.tsx => collect + external
 *       => .vue => (2)
 *       => asserts => (1)
 *       => src => return
 *   4. import '../xxx', import '../xxx.ext'
 *       => resolve
 *       => .vue => (2)
 *       => src => return
 */
function getScanImportsPlugin (deps: CollectedDeps, includes: string[], excludes: string[]) {
  const resolve = getResolve()
  // for storing vue <script> contents
  const scripts = new Map<string, { loader: esbuild.Loader, contents: string }>()

  return {
    name: 'scanImports',
    setup (build) {
      // assets
      build.onResolve(({ filter: assetsRE }), externalEsbuildModule)

      // .vue
      build.onLoad({ filter: /\.vue$/, namespace: 'vue' }, ({ path }) => {
        let raw = fs.readFileSync(path, 'utf-8')
        raw = raw.replace(commentRE, '<!---->')
        const regex = scriptRE
        regex.lastIndex = 0
        let js = ''
        let scriptId = 0
        let match: RegExpExecArray | null

        while ((match = regex.exec(raw))) {
          const [, openTag, content] = match
          const langMatch = openTag.match(langRE)
          const lang = langMatch && (langMatch[1] || langMatch[2] || langMatch[3])

          let loader: esbuild.Loader = 'js'
          if (lang === 'ts' || lang === 'tsx' || lang === 'jsx') {
            loader = lang
          }

          if (content.trim()) {
            // append imports in TS to prevent esbuild from removing them
            // since they may be used in the template
            const contents =
              content +
              (loader.startsWith('ts') ? extractImportPaths(content) : '')

            const key = `${path}?id=${scriptId++}`
            scripts.set(key, {
              loader,
              contents
            })

            const virtualModulePath = JSON.stringify(virtualModulePrefix + key)

            js += `export * from ${virtualModulePath}\n`
          }
        }

        // "export * from" syntax will not re'export "default", so we patch one.
        if (!js.includes('export default')) {
          js += 'export default {}'
        }

        return {
          loader: 'js',
          contents: js
        }
      })

      build.onResolve(({ filter: virtualModuleRE }), ({ path }) => {
        return {
          path: path.replace(virtualModulePrefix, ''),
          namespace: 'script'
        }
      })

      build.onLoad(({ filter: /.*/, namespace: 'script' }), ({ path }) => {
        return scripts.get(path)
      })

      // bare imports
      build.onResolve({ filter: moduleRE }, async ({ path: id, importer }) => {
        if (isExclude(id, excludes)) return externalEsbuildModule({ path: id })

        if (deps.has(id)) return externalEsbuildModule({ path: id })

        try {
          const resolvedPath = await resolve(path.dirname(importer), id)

          if (resolvedPath.includes('node_modules') || includes.includes(id)) {
            if (isOptimizeIncluded(resolvedPath)) {
              deps.set(id, resolvedPath)
            }
            return externalEsbuildModule({ path: id })
          } else if (isScanIncluded(resolvedPath)) {
            return {
              path: resolvedPath,
              namespace: 'vue'
            }
          } else if (assetsRE.test(resolvedPath)) {
            externalEsbuildModule({ path: id })
          } else {
            return {
              path: resolvedPath
            }
          }
        } catch (e) {
          return externalEsbuildModule({ path: id })
        }
      })

      // catch all
      build.onResolve({ filter: /.*/ }, async ({ path: id, importer }) => {
        const resolvedPath = await resolve(path.dirname(importer), id)

        const namespace = isScanIncluded(resolvedPath) ? 'vue' : undefined

        return {
          path: resolvedPath,
          namespace
        }
      })
    }
  }
}

/**
 * when using TS + (Vue + `<script setup>`) or Svelte, imports may seem
 * unused to esbuild and dropped in the build output, which prevents
 * esbuild from crawling further.
 * the solution is to add `import 'x'` for every source to force
 * esbuild to keep crawling due to potential side effects.
 */
function extractImportPaths (code: string) {
  // empty singleline & multiline comments to avoid matching comments
  code = code
    .replace(multilineCommentsRE, '/* */')
    .replace(singlelineCommentsRE, '')

  let js = ''
  let m
  while ((m = importsRE.exec(code)) != null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === importsRE.lastIndex) {
      importsRE.lastIndex++
    }
    js += `\nimport ${m[1]}`
  }
  return js
}
